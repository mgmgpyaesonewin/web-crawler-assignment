<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;
    /**
     * Test Authenticated User Profile
     */
    public function test_authenticated_user_profile(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson(route('user'));

        $response->assertStatus(200)
            ->assertJson($user->toArray());
    }
}
