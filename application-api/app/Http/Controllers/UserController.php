<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * @param Request $request
     * @return JsonResponse
     * {"id":1,"name":"Pyae Sone Win","email":"pyae@gmail.com","email_verified_at":null,
     * "created_at":"2024-03-12T10:40:33.000000Z","updated_at":"2024-03-12T10:40:33.000000Z"}
     */
    public function __invoke(Request $request)
    {
        return $request->user();
    }
}
