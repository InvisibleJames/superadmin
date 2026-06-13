<?php

namespace Database\Seeders;

use App\Models\Clinic;
use Illuminate\Database\Seeder;

class ClinicSeeder extends Seeder
{
    public function run(): void
    {
        // Ported from the handoff prototype's buildClinics().
        $data = [
            ['MedReco Central', 'Bangkok'], ['MedReco Phra Ram 9', 'Bangkok'], ['MedReco Sukhumvit', 'Bangkok'],
            ['MedReco Chiang Mai', 'Chiang Mai'], ['MedReco Phuket', 'Phuket'], ['MedReco Khon Kaen', 'Khon Kaen'],
            ['MedReco Rama 4', 'Bangkok'], ['MedReco Pattaya', 'Chonburi'], ['MedReco Hat Yai', 'Songkhla'],
            ['MedReco Korat', 'Nakhon Ratchasima'], ['MedReco Rayong', 'Rayong'], ['MedReco Nonthaburi', 'Bangkok'],
            ['MedReco Bang Na', 'Bangkok'], ['MedReco Mae Rim', 'Chiang Mai'],
        ];

        foreach ($data as $i => [$name, $province]) {
            $day = str_pad((string) (($i * 2) % 27 + 1), 2, '0', STR_PAD_LEFT);
            $mo = str_pad((string) (($i % 9) + 1), 2, '0', STR_PAD_LEFT);
            Clinic::updateOrCreate(
                ['code' => 'C' . (101 + $i)],
                [
                    'no' => (string) (100000 + $i),
                    'name' => $name,
                    'province' => $province,
                    'status' => ($i % 6 === 2 || $i % 6 === 5) ? 'inactive' : 'active',
                    'created_at' => "2025-{$mo}-{$day} 09:00:00",
                ],
            );
        }
    }
}
