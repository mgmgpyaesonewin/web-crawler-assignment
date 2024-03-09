<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSpiderCallbackRequest;
use App\Models\Keyword;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Queue;

class AppController extends Controller
{
    // Get all keywords from the database
    public function keywords(): JsonResponse
    {
        return response()->json(Keyword::all());
    }

    // Get a keyword by ID from the database
    public function keywordById(Keyword $keyword): JsonResponse
    {
        $keyword->load('contents');
        return response()->json($keyword);
    }

    public function initiateSpider(Request $request): JsonResponse
    {
        Queue::connection('sqs')->pushRaw(
            $request->input('url'),
            env('SQS_PREFIX')
        );

        return response()->json(['message' => 'Spider initiated']);
    }

    // Save the spider results to the database from callback URL
    public function spiderCallback(StoreSpiderCallbackRequest $request): JsonResponse
    {
        // Save the spider results to the database
        $keyword = Keyword::create([
            'name' => $request->input('keyword'),
            'total_result' => $request->input('total_result'),
            'contents' => $request->input('contents'),
        ]);
        $keyword->contents()->createMany($request->input('contents'));

        return response()->json([
            'message' => 'Spider results saved'
        ]);
    }
}
