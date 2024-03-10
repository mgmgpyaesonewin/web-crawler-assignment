<?php

use Illuminate\Http\Request;
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

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/keywords', [App\Http\Controllers\AppController::class, 'keywords']);
});

Route::get('/keywords/{keyword}', [App\Http\Controllers\AppController::class, 'keywordById']);

Route::post('/initiate-spider', [App\Http\Controllers\AppController::class, 'initiateSpider']);
Route::post('/spider-callback', [App\Http\Controllers\AppController::class, 'spiderCallback']);
