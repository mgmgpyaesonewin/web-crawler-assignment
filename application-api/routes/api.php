<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', [App\Http\Controllers\AppController::class, 'user']);
    Route::get('/keywords', [App\Http\Controllers\AppController::class, 'keywords'])->name('keywords');
    Route::post('/initiate-spider', [App\Http\Controllers\AppController::class, 'initiateSpider'])
        ->name('initiateSpider');
    Route::get('/keywords/{keyword}', [App\Http\Controllers\AppController::class, 'keywordById'])->name('keywordById');
});

Route::post('/spider-callback', [App\Http\Controllers\AppController::class, 'spiderCallback'])
    ->name('spiderCallback');
