<?php

namespace Database\Factories;

use App\Models\Clinic;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Clinic> */
class ClinicFactory extends Factory
{
    protected $model = Clinic::class;

    public function definition(): array
    {
        return [
            'code' => 'C' . fake()->unique()->numberBetween(1000, 9999),
            'no' => (string) fake()->unique()->numberBetween(100000, 999999),
            'name' => 'MedReco ' . fake()->city(),
            'province' => fake()->randomElement(['Bangkok', 'Chiang Mai', 'Phuket', 'Khon Kaen']),
            'status' => 'active',
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['status' => 'inactive']);
    }
}
