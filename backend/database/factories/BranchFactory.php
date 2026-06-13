<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Clinic;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Branch> */
class BranchFactory extends Factory
{
    protected $model = Branch::class;

    public function definition(): array
    {
        return [
            'clinic_id' => Clinic::factory(),
            'code' => 'BR' . fake()->unique()->numberBetween(1000, 9999),
            'name' => fake()->streetName() . ' Branch',
            'province' => fake()->randomElement(['Bangkok', 'Chiang Mai', 'Phuket']),
            'phone' => '+66 2-' . fake()->numberBetween(100, 999) . '-' . fake()->numberBetween(1000, 9999),
            'status' => 'active',
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['status' => 'inactive']);
    }
}
