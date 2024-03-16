<?php

use App\Http\Controllers\Auth\AuthenticatedTokenController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AppController;
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
    Route::get('/user', UserController::class)->name('user');
    Route::get('/keywords', [AppController::class, 'keywords'])->name('keywords');
    Route::get('/keywords/{keyword}', [AppController::class, 'keywordById'])->name('keyword.show');
    Route::post('/initiate-spider', [AppController::class, 'initiateSpider'])->name('spider.initiate');
});
Route::post('/spider-callback', [AppController::class, 'spiderCallback'])->name('spider.callback');

Route::post('/login', [AuthenticatedTokenController::class, 'store'])
    ->middleware('guest')
    ->name('login');
