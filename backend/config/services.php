<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentik (OIDC) — SSO broker for Google sign-in
    |--------------------------------------------------------------------------
    |
    | Admins sign in with Google through a self-hosted Authentik instance that
    | brokers the Google OAuth source. Our app is a standard OIDC client of
    | Authentik. See docs/authentik-setup.md for provisioning steps.
    |
    */
    'authentik' => [
        'base_url' => rtrim((string) env('AUTHENTIK_BASE_URL', ''), '/'),
        'client_id' => env('AUTHENTIK_CLIENT_ID'),
        'client_secret' => env('AUTHENTIK_CLIENT_SECRET'),
        'redirect' => env('AUTHENTIK_REDIRECT_URI', env('APP_URL') . '/auth/oauth/callback'),
        // Auto-provision a (non-super) admin account on first SSO login.
        'auto_create' => (bool) env('AUTH_OAUTH_AUTO_CREATE', false),
        // Optional comma-separated email-domain allowlist (e.g. "medreco.com").
        'allowed_domains' => array_filter(array_map('trim', explode(',', (string) env('AUTH_OAUTH_ALLOWED_DOMAINS', '')))),
    ],

];
