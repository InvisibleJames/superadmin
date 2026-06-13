<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\ClinicController;
use App\Http\Controllers\Api\MetaController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\SaUserController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/meta', [MetaController::class, 'index']);

    Route::get('/users/stats', [UserController::class, 'stats']);
    Route::post('/users/bulk', [UserController::class, 'bulk']);
    Route::apiResource('users', UserController::class);

    Route::get('/clinics/stats', [ClinicController::class, 'stats']);
    Route::post('/clinics/bulk', [ClinicController::class, 'bulk']);
    Route::apiResource('clinics', ClinicController::class);

    Route::get('/branches/stats', [BranchController::class, 'stats']);
    Route::post('/branches/bulk', [BranchController::class, 'bulk']);
    Route::apiResource('branches', BranchController::class);

    Route::get('/patients/stats', [PatientController::class, 'stats']);
    Route::post('/patients/bulk', [PatientController::class, 'bulk']);
    Route::apiResource('patients', PatientController::class);

    Route::get('/sa-users/stats', [SaUserController::class, 'stats']);
    Route::post('/sa-users/bulk', [SaUserController::class, 'bulk']);
    Route::apiResource('sa-users', SaUserController::class)->parameters(['sa-users' => 'saUser']);
});
