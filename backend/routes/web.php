<?php

use App\Http\Controllers\Auth\OAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// SSO via Authentik (brokers Google). On the web stack so OAuth `state`
// survives the redirect round-trip via the session cookie.
Route::get('/auth/oauth/redirect', [OAuthController::class, 'redirect'])->name('oauth.redirect');
Route::get('/auth/oauth/callback', [OAuthController::class, 'callback'])->name('oauth.callback');
