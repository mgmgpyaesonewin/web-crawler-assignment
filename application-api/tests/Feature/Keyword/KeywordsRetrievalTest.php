<?php

namespace Tests\Feature\Keyword;

use App\Models\Keyword;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KeywordsRetrievalTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test Get All Keywords
     */
    public function test_get_all_keywords(): void
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

    /**
     * Test Get All Keywords on user with empty keywords
     */
    public function test_get_all_keywords_on_user_with_empty_keywords(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson(route('keywords'));

        $response->assertStatus(200)
            ->assertJson([]);
    }

    /**
     * Test All Keywords should belong to the authenticated user
     */
    public function test_all_keywords_should_belong_to_the_authenticated_user(): void
    {
        $user = User::factory()->create();
        $keywords = Keyword::factory([
            'user_id' => $user->id,
        ])->count(3)->create();

        $user2 = User::factory()->create();
        Keyword::factory([
            'user_id' => $user2->id,
        ])->count(3)->create();

        $response = $this->actingAs($user)->getJson(route('keywords'));

        $response->assertStatus(200)
            ->assertJsonCount(3)
            ->assertJson($keywords->toArray());
    }
}
