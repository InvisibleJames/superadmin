<?php

namespace Tests\Feature;

use App\Models\Patient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PatientApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_filters_by_gender(): void
    {
        $this->actingAsAdmin();
        Patient::factory()->count(3)->create(['gender' => 'Female']);
        Patient::factory()->count(2)->create(['gender' => 'Male']);

        $this->getJson('/api/patients?gender=Female')
            ->assertOk()
            ->assertJsonPath('meta.total', 3);
    }

    public function test_index_searches_by_hn(): void
    {
        $this->actingAsAdmin();
        Patient::factory()->create(['hn' => 'HN-ABC123']);
        Patient::factory()->count(3)->create();

        $this->getJson('/api/patients?q=ABC123')
            ->assertOk()
            ->assertJsonPath('meta.total', 1);
    }

    public function test_stats_returns_counts(): void
    {
        $this->actingAsAdmin();
        Patient::factory()->count(4)->create(['status' => 'active']);
        Patient::factory()->inactive()->count(1)->create();

        $this->getJson('/api/patients/stats')
            ->assertOk()
            ->assertJsonPath('total', 5)
            ->assertJsonPath('active', 4)
            ->assertJsonPath('inactive', 1)
            ->assertJsonStructure(['new_this_month']);
    }
}
