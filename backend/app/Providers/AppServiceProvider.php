<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Password-reset links point at the Nuxt console, not a Blade route.
        ResetPassword::createUrlUsing(function ($notifiable, string $token) {
            $base = rtrim((string) env('FRONTEND_URL', 'http://localhost:3000'), '/');

            return $base . '/reset-password?token=' . $token
                . '&email=' . urlencode($notifiable->getEmailForPasswordReset());
        });
    }
}
