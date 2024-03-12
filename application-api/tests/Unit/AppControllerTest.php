<?php

namespace Tests\Unit;

use App\Http\Controllers\AppController;
use App\Http\Requests\StoreSpiderCallbackRequest;
use App\Models\Keyword;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class AppControllerTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Test the initiateSpider method.
     */
    public function test_initiateSpider(): void
    {
        $request = Request::create('/spider', 'POST', [
            'url' => 'https://example.com',
        ]);

        $controller = new AppController();

        // Call the initiateSpider method
        $response = $controller->initiateSpider($request);

        // Assert that the response is an instance of JsonResponse
        $this->assertInstanceOf(JsonResponse::class, $response);
    }
}
