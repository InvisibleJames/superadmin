<?php

namespace Database\Factories;

use App\Models\SaUser;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<SaUser> */
class SaUserFactory extends Factory
{
    protected $model = SaUser::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'admin_role' => fake()->randomElement(['Super Admin', 'Admin', 'Support', 'Auditor', 'Read-only']),
            'two_fa' => fake()->boolean(),
            'status' => 'active',
            'last_active_at' => now(),
        ];
    }

    public function role(string $role): static
    {
        return $this->state(fn () => ['admin_role' => $role]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['status' => 'inactive']);
    }
}
