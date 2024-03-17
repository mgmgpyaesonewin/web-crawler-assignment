<?php

use App\Http\Controllers\Auth\AuthenticatedTokenController;
use App\Http\Controllers\KeywordController;
use App\Http\Controllers\SpiderController;
use App\Http\Controllers\UserController;
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
    Route::get('/keywords', [KeywordController::class, 'index'])->name('keywords');
    Route::get('/keywords/{keyword}', [KeywordController::class, 'show'])->name('keyword.show');
    Route::post('/spider', [SpiderController::class, 'initiate'])->name('spider.initiate');
});
Route::post('/spider/callback', [SpiderController::class, 'callback'])->name('spider.callback');

Route::post('/login', [AuthenticatedTokenController::class, 'store'])
    ->middleware('guest')
    ->name('login');
