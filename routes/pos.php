<?php

use App\Http\Controllers\admin\PosController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| POS Routes
|--------------------------------------------------------------------------
|
| Routes for the Point of Sale billing system.
| Prefix: admin/pos (registered in RouteServiceProvider)
|
*/

Route::middleware('AdminAuth')->group(function () {
    // Main POS screen
    Route::get('/', [PosController::class, 'index'])->name('pos.index');

    // AJAX endpoints
    Route::get('/search', [PosController::class, 'search'])->name('pos.search');
    Route::get('/items-by-category', [PosController::class, 'getItemsByCategory'])->name('pos.items_by_category');
    Route::get('/item-details', [PosController::class, 'getItemDetails'])->name('pos.item_details');
    Route::get('/customers', [PosController::class, 'getCustomers'])->name('pos.customers');
    Route::get('/today-summary', [PosController::class, 'todaySummary'])->name('pos.today_summary');

    // Cart operations
    Route::post('/process-payment', [PosController::class, 'processPayment'])->name('pos.process_payment');
    Route::post('/hold-cart', [PosController::class, 'holdCart'])->name('pos.hold_cart');
    Route::get('/held-carts', [PosController::class, 'getHeldCarts'])->name('pos.held_carts');
    Route::get('/recall-cart/{id}', [PosController::class, 'recallCart'])->name('pos.recall_cart');
    Route::delete('/held-cart/{id}', [PosController::class, 'deleteHeldCart'])->name('pos.delete_held_cart');

    // Receipt
    Route::get('/print-receipt/{id}', [PosController::class, 'printReceipt'])->name('pos.print_receipt');
});
