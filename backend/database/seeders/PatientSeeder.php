<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Clinic;
use App\Models\Patient;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        // Name pools (seeded from the handoff prototype's patient list, expanded
        // so each clinic gets a realistic, varied roster).
        $firsts = ['Somsak', 'Wipa', 'Nattapong', 'Kulap', 'Chaiwat', 'Siriporn', 'Anong', 'Manop', 'Duangjai', 'Phaithoon', 'Rungnapa', 'Suthep', 'Ratree', 'Adisak', 'Waraporn', 'Pongsak', 'Nittaya', 'Chalerm', 'Saowanee', 'Krirk', 'Malai', 'Thawatchai'];
        $lasts = ['Phromma', 'Chuenjai', 'Siri', 'Meesuk', 'Boonmee', 'Kaew', 'Petcharat', 'Yindee', 'Rak', 'Suk', 'Dao', 'Klinmalee', 'Montha', 'Charoen', 'Lim', 'Tanaka', 'Bua', 'Wongse', 'Fah', 'Niran', 'Sanoh', 'Ek'];

        $clinics = Clinic::orderBy('id')->get();
        $branchesByClinic = Branch::all()->groupBy('clinic_id');

        $hn = 650148;
        $seq = 0;

        foreach ($clinics as $ci => $clinic) {
            $count = 8 + ($ci * 5) % 16; // 8–23 patients per clinic
            $branches = $branchesByClinic->get($clinic->id);

            for ($i = 0; $i < $count; $i++) {
                $first = $firsts[($ci * 3 + $i) % count($firsts)];
                $last = $lasts[($ci * 5 + $i * 7) % count($lasts)];
                $gender = ($seq % 2 === 0) ? 'Male' : 'Female';
                $age = 18 + ($seq * 7) % 62;
                $status = ($seq % 7 === 3 || $seq % 7 === 6) ? 'inactive' : 'active';

                $branch = $branches && $branches->isNotEmpty() ? $branches[$i % $branches->count()] : null;

                $cm = str_pad((string) (($seq % 6) + 1), 2, '0', STR_PAD_LEFT);
                $cd = str_pad((string) (($seq * 3) % 27 + 1), 2, '0', STR_PAD_LEFT);
                $vm = str_pad((string) (($seq % 5) + 2), 2, '0', STR_PAD_LEFT);
                $vd = str_pad((string) (($seq * 5) % 27 + 1), 2, '0', STR_PAD_LEFT);

                Patient::create([
                    'hn' => 'HN-' . $hn,
                    'name' => "{$first} {$last}",
                    'gender' => $gender,
                    'age' => $age,
                    'clinic_id' => $clinic->id,
                    'branch_id' => $branch?->id,
                    'phone' => '08' . ($seq % 9) . '-' . str_pad((string) (1000 + $seq * 7), 4, '0', STR_PAD_LEFT) . '-' . str_pad((string) (100 + $seq * 3), 4, '0', STR_PAD_LEFT),
                    'last_visit_at' => "2025-{$vm}-{$vd}",
                    'status' => $status,
                    'created_at' => "2025-{$cm}-{$cd} 09:00:00",
                ]);

                $hn += 137;
                $seq++;
            }
        }
    }
}
