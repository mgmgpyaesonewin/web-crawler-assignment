<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSpiderCallbackRequest;
use App\Models\Keyword;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Queue;

/**
 * @group Spider AIP endpoints
 *
 * APIs for crawling the web
 */
class SpiderController extends Controller
{
    /**
     * @group Spider AIP endpoints
     * @param Request $request (URL required URL as comma seperated keywords
     * @return JsonResponse
     */
    public function initiate(Request $request): JsonResponse
    {
        $request->validate([
            'url' => 'required|string',
        ]);

        Queue::connection('sqs')->pushRaw(json_encode([
            'url' => $request->input('url'),
            'user_id' => $request->user()->id,
        ]),
            env('SQS_PREFIX')
        );

        return response()->json(['message' => 'Spider initiated']);
    }

    /**
     * Save the spider results to the database from callback URL
     * @group Spider AIP endpoints
     * @param StoreSpiderCallbackRequest $request
     * @return JsonResponse
     * {"user_id":9,"keyword":"where is myanmar","total_result":null,"contents":[{
     * "title":"Geography of Myanmar - Wikipedia","link":"https://en.wikipedia.org/wiki/Geography_of_Myanmar",
     * "htmlRaw":"<div>This is a html tag</div>"}]}
     */
    public function callback(StoreSpiderCallbackRequest $request): JsonResponse
    {
        // Save the spider results to the database
        $keyword = Keyword::create($request->only([
            'name',
            'total_result',
            'user_id',
            'ads_count',
            'links_count',
            'page_content'
        ]));
        $keyword->contents()->createMany($request->input('contents'));

        return response()->json([
            'message' => 'Spider results saved'
        ]);
    }
}
