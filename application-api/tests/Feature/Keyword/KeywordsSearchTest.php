<?php

namespace Tests\Feature\Keyword;

use App\Models\Keyword;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KeywordsSearchTest extends TestCase
{
    use RefreshDatabase;

    protected User|Collection|Model $user;
    protected Keyword|Collection|Model $search_engine_keyword;
    protected Keyword|Collection|Model $ads_keyword;
    protected Keyword|Collection|Model $seo_keyword;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();

        $this->ads_keyword = Keyword::factory([
            'user_id' => $this->user->id,
            'name' => 'ads',
            'total_result' => '10',
        ])->create();

        $this->seo_keyword = Keyword::factory([
            'user_id' => $this->user->id,
            'name' => 'seo',
            'total_result' => '20',
        ])->create();

        $this->search_engine_keyword = Keyword::factory([
            'user_id' => $this->user->id,
            'name' => 'search engine',
            'total_result' => '30',
        ])->create();
    }

    /**
     * Test search keywords with exact match
     */
    public function test_search_keywords_with_exact_match(): void
    {
        $response = $this->actingAs($this->user)->getJson(route('keywords', ['search' => 'ads']));

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJson([$this->ads_keyword->toArray()]);
    }

    /**
     * Test search keywords with partial match
     */
    public function test_search_keywords_with_partial_match(): void
    {
        $response = $this->actingAs($this->user)->getJson(route('keywords', ['search' => 'se']));

        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJson([
                $this->seo_keyword->toArray(),
                $this->search_engine_keyword->toArray(),
            ]);
    }

    /**
     * Test search keywords with case-insensitive match
     */
    public function test_search_keywords_with_case_insensitive_match(): void
    {
        $response = $this->actingAs($this->user)->getJson(route('keywords', ['search' => 'SeO']));

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJson([$this->seo_keyword->toArray()]);
    }

    /**
     * Test search keywords with no match
     */
    public function test_search_keywords_with_no_match(): void
    {
        $response = $this->actingAs($this->user)->getJson(route('keywords', ['search' => 'no match']));

        $response->assertStatus(200)
            ->assertJson([]);
    }
}
