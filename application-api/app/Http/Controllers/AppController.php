<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSpiderCallbackRequest;
use App\Models\Keyword;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Queue;

class AppController extends Controller
{
    public function user(Request $request) {
        return $request->user();
    }

    // Get all keywords from the database
    public function keywords(): JsonResponse
    {
        if (request()->input('search')) {
            $keywords = auth()->user()->keywords()
                ->where(function ($query) {
                    $query->where('name', 'like', '%' . request()->input('search') . '%')
                        ->orWhereHas('contents', function ($subQuery) {
                            $subQuery->where('title', 'like', '%' . request()->input('search') . '%');
                        });
                })
                ->get();

            $keywords->load('contents');

            return response()->json($keywords);
        }

        $keywords = auth()->user()->keywords;
        $keywords->load('contents');

        return response()->json($keywords);
    }

    // Get a keyword by ID from the database
    public function keywordById(Keyword $keyword): JsonResponse
    {
        $keyword->load('contents');
        return response()->json($keyword);
    }

    public function initiateSpider(Request $request): JsonResponse
    {
        Queue::connection('sqs')->pushRaw(json_encode([
                'url' => $request->input('url'),
                'user_id' => $request->user()->id ?? 1,
            ]),
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
            'user_id' => $request->input('user_id'),
        ]);
        $keyword->contents()->createMany($request->input('contents'));

        return response()->json([
            'message' => 'Spider results saved'
        ]);
    }
}
