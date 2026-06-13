<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_succeeds_with_valid_credentials(): void
    {
        User::factory()->create([
            'email' => 'admin@medreco.com',
            'password' => Hash::make('password'),
        ]);

        $this->postJson('/api/auth/login', [
            'email' => 'admin@medreco.com',
            'password' => 'password',
        ])
            ->assertOk()
            ->assertJsonStructure(['token', 'user' => ['id', 'email']]);
    }

    public function test_login_fails_with_invalid_password(): void
    {
        User::factory()->create(['email' => 'admin@medreco.com']);

        $this->postJson('/api/auth/login', [
            'email' => 'admin@medreco.com',
            'password' => 'wrong-password',
        ])->assertStatus(422);
    }

    public function test_login_rejects_inactive_user(): void
    {
        User::factory()->inactive()->create([
            'email' => 'off@medreco.com',
            'password' => Hash::make('password'),
        ]);

        $this->postJson('/api/auth/login', [
            'email' => 'off@medreco.com',
            'password' => 'password',
        ])->assertStatus(422);
    }

    public function test_me_returns_authenticated_user(): void
    {
        $admin = $this->actingAsAdmin();

        $this->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('data.email', $admin->email);
    }

    public function test_protected_route_requires_authentication(): void
    {
        $this->getJson('/api/users')->assertUnauthorized();
    }

    public function test_forgot_password_sends_reset_notification(): void
    {
        Notification::fake();
        $user = User::factory()->create(['email' => 'reset@medreco.com']);

        $this->postJson('/api/auth/forgot-password', ['email' => 'reset@medreco.com'])
            ->assertOk();

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_reset_password_updates_the_password(): void
    {
        $user = User::factory()->create([
            'email' => 'reset@medreco.com',
            'password' => Hash::make('old-password'),
        ]);
        $token = Password::createToken($user);

        $this->postJson('/api/auth/reset-password', [
            'token' => $token,
            'email' => 'reset@medreco.com',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])->assertOk();

        $this->assertTrue(Hash::check('new-password', $user->fresh()->password));
    }
}
