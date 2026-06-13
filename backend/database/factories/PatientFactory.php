<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Patient> */
class PatientFactory extends Factory
{
    protected $model = Patient::class;

    public function definition(): array
    {
        return [
            'hn' => 'HN-' . fake()->unique()->numberBetween(100000, 999999),
            'name' => fake()->name(),
            'gender' => fake()->randomElement(['Male', 'Female']),
            'age' => fake()->numberBetween(18, 80),
            'phone' => '08' . fake()->numerify('#-####-####'),
            'last_visit_at' => fake()->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'status' => 'active',
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['status' => 'inactive']);
    }
}
