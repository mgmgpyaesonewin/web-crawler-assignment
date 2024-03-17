<?php

namespace App\Http\Controllers;

use App\Http\Resources\KeywordResource;
use App\Models\Keyword;
use Illuminate\Http\JsonResponse;


/**
 * @group Keyword management
 *
 * APIs for managing keywords
 */
class KeywordController extends Controller
{
    /**
     * @group Keyword management
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
    public function index(): JsonResponse
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

            return response()->json([
                'keywords' => KeywordResource::collection($keywords)
            ]);
        }

        $keywords = auth()->user()->keywords;

        return response()->json([
            'keywords' => KeywordResource::collection($keywords)
        ]);
    }

    /**
     * @group Keyword management
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
    public function show(Keyword $keyword): JsonResponse
    {
        $keyword->load('contents');
        return response()->json($keyword);
    }
}
