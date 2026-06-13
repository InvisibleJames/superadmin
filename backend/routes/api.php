<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MetaController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/meta', [MetaController::class, 'index']);

    Route::get('/users/stats', [UserController::class, 'stats']);
    Route::post('/users/bulk', [UserController::class, 'bulk']);
    Route::apiResource('users', UserController::class);
});
