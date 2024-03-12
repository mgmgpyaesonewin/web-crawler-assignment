<?php

namespace Tests\Feature;

use App\Models\Content;
use App\Models\Keyword;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class AppTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function testKeywords()
    {
        $user = User::factory()->create();
        $keywords = Keyword::factory([
            'user_id' => $user->id,
        ])->count(3)->create();

        $response = $this->actingAs($user)->getJson(route('keywords'));

        $response->assertStatus(200)
            ->assertJsonCount(3)
            ->assertJson($keywords->toArray());
    }

    public function testKeywordById()
    {
        $user = User::factory()->create();
        $keyword = Keyword::factory([
                'user_id' => $user->id,
        ])->create();

        $response = $this->actingAs($user)->getJson(route('keywordById', $keyword));

        $response->assertStatus(200)
            ->assertJson($keyword->toArray());
    }

    public function testInitiateSpider()
    {
        Queue::fake();

        $user = User::factory()->create();
        $url = 'test1, test2, test3';

        $response = $this->actingAs($user)->postJson(route('initiateSpider'), ['url' => $url]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Spider initiated']);

        Queue::shouldReceive('connection')->with('sqs')->andReturnSelf();
        Queue::shouldReceive('pushRaw')->with(json_encode([
            'url' => $url,
            'user_id' => $user->id,
        ]), env('SQS_PREFIX'))->andReturn(true);
    }

    public function testSpiderCallback()
    {
        $user = User::factory()->create();

        $data = [
            'keyword' => 'Test Keyword',
            'total_result' => '10',
            'user_id' => $user->id,
            'contents' => [
                ['title' => 'Content 1', 'link' => 'http://example.com/1'],
                ['title' => 'Content 2', 'link' => 'http://example.com/2'],
            ],
        ];

        $response = $this->postJson(route('spiderCallback'), $data);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Spider results saved']);

        $this->assertDatabaseHas('keywords', [
            'name' => $data['keyword'],
            'total_result' => $data['total_result'],
            'user_id' => $data['user_id'],
        ]);

        foreach ($data['contents'] as $content) {
            $this->assertDatabaseHas('contents', $content);
        }
    }
}
