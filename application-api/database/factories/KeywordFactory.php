<?php

namespace Database\Factories;

use App\Models\Keyword;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Keyword>
 */
class KeywordFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word,
            'total_result' => $this->faker->numberBetween(1, 100),
            'user_id' => User::factory(),
        ];
    }
}
