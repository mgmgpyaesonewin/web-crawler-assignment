<?php

namespace Tests\Feature\Spider;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SpiderCallbackExecutionTest extends TestCase
{
    use RefreshDatabase;
    protected User|Collection|Model $user;

    public function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /**
     * Test spider callback execution with valid input data.
     */
    public function test_spider_callback_execution_with_valid_input_data(): void
    {
        $contents = [
            ['title' => 'Content 1', 'link' => 'http://example.com/1'],
            ['title' => 'Content 2', 'link' => 'http://example.com/2'],
        ];

        $response = $this->postJson(route('spider.callback'), [
            'keyword' => 'Test Keyword',
            'total_result' => '10',
            'user_id' => $this->user->id,
            'contents' => $contents,
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Spider results saved']);

        $this->assertDatabaseHas('keywords', [
            'name' => 'Test Keyword',
            'total_result' => '10',
            'user_id' => $this->user->id,
        ]);

        foreach ($contents as $content) {
            $this->assertDatabaseHas('contents', $content);
        }
    }

    /**
     * Test spider callback execution with invalid input data.
     */
    public function test_spider_callback_execution_with_invalid_input_data(): void
    {
        $response = $this->postJson(route('spider.callback'), [
            'keyword' => '',
            'total_result' => '',
            'user_id' => $this->user->id,
            'contents' => [
                ['title' => 'Content 1', 'link' => 'http://example.com/1'],
                ['title' => 'Content 2', 'link' => 'http://example.com/2'],
            ],
        ]);

        $response->assertStatus(422);
    }

    // TODO: Test spider callback execution for unauthenticated Client ID and Client Secret.
}
