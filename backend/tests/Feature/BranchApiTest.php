<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Clinic;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BranchApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_searches_by_parent_clinic_name(): void
    {
        $this->actingAsAdmin();
        $phuket = Clinic::factory()->create(['name' => 'MedReco Phuket']);
        $other = Clinic::factory()->create(['name' => 'MedReco Central']);
        // Branch own fields avoid "Phuket" so only the parent-clinic name matches.
        Branch::factory()->count(3)->create(['clinic_id' => $phuket->id, 'province' => 'Bangkok']);
        Branch::factory()->count(2)->create(['clinic_id' => $other->id, 'province' => 'Bangkok']);

        $this->getJson('/api/branches?q=Phuket')
            ->assertOk()
            ->assertJsonPath('meta.total', 3);
    }

    public function test_stats_counts_distinct_clinics_covered(): void
    {
        $this->actingAsAdmin();
        $a = Clinic::factory()->create();
        $b = Clinic::factory()->create();
        Branch::factory()->count(2)->create(['clinic_id' => $a->id]);
        Branch::factory()->create(['clinic_id' => $b->id]);

        $this->getJson('/api/branches/stats')
            ->assertOk()
            ->assertJsonPath('total', 3)
            ->assertJsonPath('clinics', 2);
    }

    public function test_index_filters_by_clinic_id(): void
    {
        $this->actingAsAdmin();
        $a = Clinic::factory()->create();
        Branch::factory()->count(2)->create(['clinic_id' => $a->id]);
        Branch::factory()->count(3)->create();

        $this->getJson("/api/branches?clinic_id={$a->id}")
            ->assertOk()
            ->assertJsonPath('meta.total', 2);
    }
}
