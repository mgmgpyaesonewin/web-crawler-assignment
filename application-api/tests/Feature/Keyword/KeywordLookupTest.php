<?php

namespace Tests\Feature\Keyword;

use App\Models\Keyword;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KeywordLookupTest extends TestCase
{
    use RefreshDatabase;

    protected User|Collection|Model $user;
    protected Keyword|Collection|Model $search_engine_keyword;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->search_engine_keyword = Keyword::factory([
            'user_id' => $this->user->id,
            'name' => 'search engine',
            'total_result' => '30',
        ])->create();
    }
    /**
     * Test Get Keywords by Valid ID
     */
    public function test_get_keywords_by_valid_id(): void
    {
        $response = $this->actingAs($this->user)->getJson(route('keyword.show', 1));

        $response->assertStatus(200)
            ->assertJson($this->search_engine_keyword->toArray());
    }

    /**
     * Test Get Keywords by Invalid ID
     */
    public function test_get_keywords_by_invalid_id(): void
    {
        $response = $this->actingAs($this->user)->getJson(route('keyword.show', 2));

        $response->assertStatus(404);
    }
}
