<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSpiderCallbackRequest;
use App\Models\Keyword;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Queue;

class AppController extends Controller
{
    /**
     * Get all keywords from the database
     * @queryParam search string To Filter the keywords, optionally
     * @return JsonResponse
     * [{"id":1,"name":"zoro","total_result":"About 74,500,000 results (0.43 seconds)","user_id":1,
     * "created_at":"2024-03-12T10:40:45.000000Z","updated_at":"2024-03-12T10:40:45.000000Z",
     * "contents":[{"id":1,"title":"Roronoa Zoro | One Piece Wiki - Fandom",
     * "link":"https://onepiece.fandom.com/wiki/Roronoa_Zoro","htmlRaw":"<div>This is a div</div>",
     * "type":"data","keyword_id":1,"created_at":"2024-03-12T10:40:45.000000Z",
     * "updated_at":"2024-03-12T10:40:45.000000Z"}]}]
     */
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

    /**
     * Get a keyword by ID from the database
     *
     * @param Keyword $keyword
     * @return JsonResponse
     * {"id":1,"name":"zoro","total_result":"About 74,500,000 results (0.43 seconds)","user_id":1,
     * "created_at":"2024-03-12T10:40:45.000000Z","updated_at":"2024-03-12T10:40:45.000000Z",
     * "contents":[{"id":1,"title":"Roronoa Zoro | One Piece Wiki - Fandom",
     * "link":"https://onepiece.fandom.com/wiki/Roronoa_Zoro","htmlRaw":"<div>This is a div</div>",
     * "type":"data","keyword_id":1,"created_at":"2024-03-12T10:40:45.000000Z",
     * "updated_at":"2024-03-12T10:40:45.000000Z"}]}
     */
    public function keywordById(Keyword $keyword): JsonResponse
    {
        $keyword->load('contents');
        return response()->json($keyword);
    }

    /**
     * @param Request $request (URL required URL as comma seperated keywords
     * @return JsonResponse
     */
    public function initiateSpider(Request $request): JsonResponse
    {
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
     *
     * @param StoreSpiderCallbackRequest $request
     * @return JsonResponse
     * {"user_id":9,"keyword":"where is myanmar","total_result":null,"contents":[{
     * "title":"Geography of Myanmar - Wikipedia","link":"https://en.wikipedia.org/wiki/Geography_of_Myanmar",
     * "htmlRaw":"<div>This is a html tag</div>"}]}
     */
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
