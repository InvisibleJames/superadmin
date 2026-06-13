<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Clinic;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        // Ported from the handoff prototype's buildBranches().
        $names = ['Main Branch', 'North Wing', 'Riverside', 'Downtown', 'Airport Plaza', 'Central Mall', 'Old Town', 'Suburb East', 'Lakeview', 'Hospital Rd', 'Night Market', 'Seaside', 'Hilltop', 'Station Sq', 'Garden Court', 'Bayfront', 'City Center', 'Westgate'];
        $clinicNames = ['MedReco Central', 'MedReco Chiang Mai', 'MedReco Phuket', 'MedReco Khon Kaen', 'MedReco Sukhumvit', 'MedReco Rama 4'];
        $prov = ['Bangkok', 'Chiang Mai', 'Phuket', 'Khon Kaen', 'Bangkok', 'Bangkok'];

        $clinics = Clinic::whereIn('name', $clinicNames)->get()->keyBy('name');
        $fallback = Clinic::first();

        foreach ($names as $i => $n) {
            $day = str_pad((string) (($i * 3) % 27 + 1), 2, '0', STR_PAD_LEFT);
            $mo = str_pad((string) (($i % 8) + 1), 2, '0', STR_PAD_LEFT);
            $ci = $i % count($clinicNames);
            $clinic = $clinics->get($clinicNames[$ci]) ?? $fallback;

            Branch::updateOrCreate(
                ['code' => 'BR' . (100 + $i)],
                [
                    'clinic_id' => $clinic->id,
                    'name' => $n,
                    'province' => $prov[$ci],
                    'phone' => '+66 ' . (2 + ($i % 7)) . '-' . (100 + $i * 7) . '-' . (2000 + $i * 13),
                    'status' => ($i % 5 === 3) ? 'inactive' : 'active',
                    'created_at' => "2025-{$mo}-{$day} 09:00:00",
                ],
            );
        }
    }
}
