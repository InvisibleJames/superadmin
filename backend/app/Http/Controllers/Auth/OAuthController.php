<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * SSO sign-in through Authentik (which brokers Google).
 *
 * Standard OIDC Authorization Code flow:
 *   redirect()  -> bounce the browser to Authentik's /authorize
 *   callback()  -> exchange the code, read userinfo, log the admin in,
 *                  then hand a Sanctum token back to the Nuxt console.
 *
 * These live on the web (session-enabled) routes so OAuth `state` survives the
 * round-trip; both legs happen on the API domain, so the session cookie holds.
 */
class OAuthController extends Controller
{
    public function redirect(Request $request): RedirectResponse
    {
        $cfg = config('services.authentik');

        if (empty($cfg['base_url']) || empty($cfg['client_id'])) {
            return redirect($this->frontend('/login', ['error' => 'oauth_unconfigured']));
        }

        $state = Str::random(40);
        $nonce = Str::random(40);
        $request->session()->put('oauth.state', $state);
        $request->session()->put('oauth.nonce', $nonce);

        $params = http_build_query([
            'response_type' => 'code',
            'client_id' => $cfg['client_id'],
            'redirect_uri' => $cfg['redirect'],
            'scope' => 'openid email profile',
            'state' => $state,
            'nonce' => $nonce,
        ]);

        return redirect($cfg['base_url'] . '/application/o/authorize/?' . $params);
    }

    public function callback(Request $request): RedirectResponse
    {
        $cfg = config('services.authentik');

        if ($request->filled('error')) {
            return redirect($this->frontend('/login', ['error' => 'oauth_denied']));
        }

        // CSRF: the returned state must match what we stored.
        $expected = $request->session()->pull('oauth.state');
        if (! $expected || ! hash_equals($expected, (string) $request->query('state'))) {
            return redirect($this->frontend('/login', ['error' => 'oauth_state']));
        }

        $code = (string) $request->query('code');
        if ($code === '') {
            return redirect($this->frontend('/login', ['error' => 'oauth_no_code']));
        }

        // 1) Exchange the authorization code for tokens.
        $tokenRes = Http::asForm()->post($cfg['base_url'] . '/application/o/token/', [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => $cfg['redirect'],
            'client_id' => $cfg['client_id'],
            'client_secret' => $cfg['client_secret'],
        ]);

        if (! $tokenRes->successful() || ! $tokenRes->json('access_token')) {
            Log::warning('Authentik token exchange failed', ['body' => $tokenRes->body()]);

            return redirect($this->frontend('/login', ['error' => 'oauth_token']));
        }

        // 2) Read the profile from the userinfo endpoint.
        $userinfo = Http::withToken($tokenRes->json('access_token'))
            ->get($cfg['base_url'] . '/application/o/userinfo/')
            ->json();

        $email = $userinfo['email'] ?? null;
        if (! $email) {
            return redirect($this->frontend('/login', ['error' => 'oauth_no_email']));
        }

        // 3) Optional email-domain allowlist.
        if (! empty($cfg['allowed_domains'])) {
            $domain = Str::after($email, '@');
            if (! in_array($domain, $cfg['allowed_domains'], true)) {
                return redirect($this->frontend('/login', ['error' => 'oauth_domain']));
            }
        }

        // 4) Resolve the admin account.
        $user = User::where('email', $email)->first();

        if (! $user) {
            if (! $cfg['auto_create']) {
                return redirect($this->frontend('/login', ['error' => 'oauth_no_account']));
            }
            $user = User::create([
                'name' => $userinfo['name'] ?? Str::before($email, '@'),
                'email' => $email,
                'username' => $userinfo['preferred_username'] ?? Str::before($email, '@'),
                'password' => Hash::make(Str::random(40)),
                'status' => 'active',
                'is_super_admin' => false,
                'email_verified_at' => now(),
            ]);
        }

        if ($user->status !== 'active') {
            return redirect($this->frontend('/login', ['error' => 'oauth_inactive']));
        }

        $user->forceFill(['last_login_at' => now()])->save();
        $token = $user->createToken('admin-console-sso')->plainTextToken;

        // 5) Hand the token to the SPA, which stores it and continues.
        return redirect($this->frontend('/auth/callback', ['token' => $token]));
    }

    /** Build a URL on the Nuxt console. */
    private function frontend(string $path, array $query = []): string
    {
        $base = rtrim((string) env('FRONTEND_URL', 'http://localhost:3000'), '/');
        $url = $base . $path;

        return $query ? $url . '?' . http_build_query($query) : $url;
    }
}
