<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\ProductController;
use App\Http\Controllers\api\OrderController;
use App\Http\Controllers\api\InventoryController;

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

// Public Routes (Rate limited to 60 req/min)
Route::middleware('throttle:60,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    
    // Product Catalog
    Route::get('/categories', [ProductController::class, 'categories']);
    Route::get('/products', [ProductController::class, 'products']);
    Route::get('/products/{id}', [ProductController::class, 'productDetails']);
});

// Protected Routes (Rate limited to 120 req/min, requires Auth and Activity Logging)
Route::middleware(['auth:sanctum', 'throttle:120,1', \App\Http\Middleware\ActivityLogger::class.':API,API Request'])->group(function () {
    
    // Auth Profile
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Orders
    Route::get('/orders', [OrderController::class, 'history']);
    Route::get('/orders/{id}', [OrderController::class, 'details']);
    Route::post('/orders', [OrderController::class, 'store']);

    // Inventory
    Route::get('/inventory/stock', [InventoryController::class, 'stock']);

});
