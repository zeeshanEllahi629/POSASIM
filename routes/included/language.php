<?php


use App\Http\Controllers\addons\included\LanguageController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/language-{lang}', [LanguageController::class, 'change'])->name('language');

Route::group(['namespace' => 'admin', 'prefix' => 'admin'], function () {
    Route::group(['middleware' => 'AdminAuth'], function () {
        Route::group(['prefix' => 'language-settings/language'], function () {
            Route::get('/add', [LanguageController::class, 'add']);
            Route::post('/store', [LanguageController::class, 'store']);
        });
        Route::group(['prefix' => 'language-settings'], function () {
            Route::get('/', [LanguageController::class, 'index']);
            Route::post('/update', [LanguageController::class, 'storeLanguageData']);
            Route::get('/language/edit-{id}', [LanguageController::class, 'edit']);
            Route::post('/update-{id}', [LanguageController::class, 'update']);
            Route::get('/layout/update-{id}/{status}', [LanguageController::class, 'layout']);
            Route::get('/status-{id}/{status}', [LanguageController::class, 'status']);
            Route::get('language/delete-{id}/{status}', [LanguageController::class, 'delete']);
            Route::get('/{code}', [LanguageController::class, 'index']);
        });
    });
});
