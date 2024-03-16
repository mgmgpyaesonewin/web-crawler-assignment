<?php

namespace Tests\Feature\Spider;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SpiderInitTest extends TestCase
{
    use RefreshDatabase;

    protected User|Collection|Model $user;

    public function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /*
     * Test spider is successfully initiated with valid input data.
     */
    public function test_spider_initiated_successfully(): void
    {
        Queue::fake();

        $url = 'test1, test2, test3';
        $response = $this->actingAs($this->user)->postJson(route('spider.initiate'), ['url' => $url]);
        $response->assertStatus(200)->assertJson(['message' => 'Spider initiated']);

        Queue::shouldReceive('connection')->with('sqs')->andReturnSelf();
        Queue::shouldReceive('pushRaw')->with(json_encode([
            'url' => $url,
            'user_id' => $this->user->id,
        ]), env('SQS_PREFIX'))->andReturn(true);
    }

    /*
     * Test spider is not initiated with invalid input data.
     */
    public function test_spider_not_initiated_with_invalid_input(): void
    {
        $response = $this->actingAs($this->user)->postJson(route('spider.initiate'), ['url' => '']);
        $response->assertStatus(422);
    }

    /*
     * Test spider is not initiated for unauthenticated user.
     */
    public function test_spider_not_initiated_for_unauthenticated_user(): void
    {
        $response = $this->postJson(route('spider.initiate'), ['url' => 'test1, test2, test3']);
        $response->assertStatus(401);
    }
}
