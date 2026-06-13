<?php

namespace Database\Seeders;

use App\Models\SaUser;
use Illuminate\Database\Seeder;

class SaUserSeeder extends Seeder
{
    public function run(): void
    {
        // Ported from the handoff prototype's buildSaUsers().
        $data = [
            ['Akira Tanaka', 'Super Admin'], ['Lena Petrova', 'Super Admin'], ['Marcus Reid', 'Admin'],
            ['Priya Nair', 'Admin'], ['Chen Wei', 'Support'], ['Sofia Marin', 'Support'],
            ['David Okoro', 'Auditor'], ['Hana Kim', 'Admin'], ['Omar Haddad', 'Read-only'],
            ['Elena Rossi', 'Support'], ['Tom Becker', 'Admin'], ['Yuki Sato', 'Auditor'],
            ['Nina Costa', 'Read-only'], ['Raj Mehta', 'Admin'],
        ];

        foreach ($data as $i => [$name, $role]) {
            $status = ($i % 6 === 4) ? 'inactive' : 'active';
            $day = str_pad((string) (($i * 2) % 27 + 1), 2, '0', STR_PAD_LEFT);
            $mo = str_pad((string) (($i % 9) + 1), 2, '0', STR_PAD_LEFT);
            $hr = str_pad((string) (8 + ($i * 3) % 12), 2, '0', STR_PAD_LEFT);
            $mn = str_pad((string) (($i * 13) % 60), 2, '0', STR_PAD_LEFT);

            SaUser::updateOrCreate(
                ['email' => strtolower(str_replace(' ', '.', $name)) . '@medreco.io'],
                [
                    'name' => $name,
                    'admin_role' => $role,
                    'two_fa' => $i % 4 !== 2,
                    'status' => $status,
                    'last_active_at' => $status === 'active' ? "2025-06-11 {$hr}:{$mn}:00" : null,
                    'created_at' => "2025-{$mo}-{$day} 09:00:00",
                ],
            );
        }
    }
}
