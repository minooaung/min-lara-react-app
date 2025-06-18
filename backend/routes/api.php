<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    //Route::apiResource('/users', UserController::class);
    
    // Publicly accessible user retrieval routes
    Route::get('/users', [UserController::class, 'index']);          // Get all users
    Route::get('/users/{id}', [UserController::class, 'show']);      // Get a specific user

    Route::middleware('admin')->group(function() {
        // Admin-only routes

        Route::post('/users', [UserController::class, 'store']);         // Create a new user    
        Route::put('/users/{id}', [UserController::class, 'update']);    // Update a specific user
        Route::delete('/users/{id}', [UserController::class, 'destroy']); // Delete a specific user
    });
    
});

// Authentication routes
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/sanctum/csrf-cookie', function (Request $request) {
    return response()->json(['message' => 'CSRF cookie set']);
});


