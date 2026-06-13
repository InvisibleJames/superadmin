<?php

namespace Tests\Feature;

use App\Models\SaUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SaUserApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_filters_by_admin_role(): void
    {
        $this->actingAsAdmin();
        SaUser::factory()->role('Super Admin')->count(2)->create();
        SaUser::factory()->role('Support')->count(3)->create();

        $this->getJson('/api/sa-users?admin_role=Super Admin')
            ->assertOk()
            ->assertJsonPath('meta.total', 2);
    }

    public function test_resource_exposes_role_tone_and_code(): void
    {
        $this->actingAsAdmin();
        SaUser::factory()->role('Auditor')->create();

        $this->getJson('/api/sa-users?admin_role=Auditor')
            ->assertOk()
            ->assertJsonPath('data.0.admin_role_tone', 'violet')
            ->assertJsonPath('data.0.admin_role', 'Auditor');
    }

    public function test_stats_counts_super_admins_and_two_fa(): void
    {
        $this->actingAsAdmin();
        SaUser::factory()->role('Super Admin')->count(2)->create(['two_fa' => true]);
        SaUser::factory()->role('Admin')->create(['two_fa' => false]);

        $this->getJson('/api/sa-users/stats')
            ->assertOk()
            ->assertJsonPath('total', 3)
            ->assertJsonPath('super_admins', 2)
            ->assertJsonPath('two_fa', 2);
    }
}
