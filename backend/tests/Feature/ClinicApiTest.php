<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Clinic;
use App\Models\Patient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClinicApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_includes_branch_and_patient_counts(): void
    {
        $this->actingAsAdmin();
        $clinic = Clinic::factory()->create();
        Branch::factory()->count(2)->create(['clinic_id' => $clinic->id]);
        Patient::factory()->count(5)->create(['clinic_id' => $clinic->id]);

        $this->getJson('/api/clinics?per_page=10')
            ->assertOk()
            ->assertJsonPath('data.0.branches_count', 2)
            ->assertJsonPath('data.0.patients_count', 5);
    }

    public function test_index_filters_by_province_and_status(): void
    {
        $this->actingAsAdmin();
        Clinic::factory()->create(['province' => 'Bangkok', 'status' => 'active']);
        Clinic::factory()->create(['province' => 'Phuket', 'status' => 'active']);
        Clinic::factory()->inactive()->create(['province' => 'Bangkok']);

        $this->getJson('/api/clinics?province=Bangkok&status=active')
            ->assertOk()
            ->assertJsonPath('meta.total', 1);
    }

    public function test_stats_returns_totals(): void
    {
        $this->actingAsAdmin();
        Clinic::factory()->count(3)->create(['status' => 'active']);
        Clinic::factory()->inactive()->count(2)->create();

        $this->getJson('/api/clinics/stats')
            ->assertOk()
            ->assertJsonPath('total', 5)
            ->assertJsonPath('active', 3)
            ->assertJsonPath('inactive', 2);
    }

    public function test_bulk_delete(): void
    {
        $this->actingAsAdmin();
        $clinics = Clinic::factory()->count(2)->create();

        $this->postJson('/api/clinics/bulk', [
            'action' => 'delete',
            'ids' => $clinics->pluck('id')->all(),
        ])->assertOk()->assertJsonPath('affected', 2);

        $this->assertSame(0, Clinic::whereIn('id', $clinics->pluck('id'))->count());
    }
}
