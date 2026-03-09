<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HistoryController;

// Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

// AI Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/generate-email', [AiController::class, 'generateEmail']);
    Route::any('/debug-code', [AiController::class, 'debugCode']);
});

// History Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/history', [HistoryController::class, 'index']);
});
