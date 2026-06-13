<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Clinic;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $roles = Role::all()->keyBy('name');
        $clinic = Clinic::where('name', 'MedReco Central')->first() ?? Clinic::first();
        $branches = Branch::all()->values();

        // The Super Admin login account.
        User::updateOrCreate(
            ['email' => 'admin@medreco.com'],
            [
                'name' => 'Super Admin',
                'username' => 'superadmin',
                'password' => Hash::make('password'),
                'role_id' => $roles->get('Business Owner')?->id,
                'clinic_id' => $clinic?->id,
                'branch_id' => $branches->first()?->id,
                'status' => 'active',
                'is_super_admin' => true,
                'email_verified_at' => now(),
            ],
        );

        // Ported from the handoff prototype's buildUsers().
        $names = ['Thanawat Srisombat', 'Oranee Wattana', 'Pichit Chaikij', 'Supanut Janthasiri', 'Somchai Jaidee', 'Naphat Boonmee', 'Kanya Phongam', 'Wichai Tongdee', 'Pranee Suksawat', 'Anan Rattana', 'Malee Chinnawong', 'Decha Pakdee', 'Sasithorn Meechai', 'Krit Wongsawang', 'Benjawan Sukhum', 'Narin Aphai', 'Ploy Charoen', 'Anucha Ruangrit', 'Wanida Klaharn', 'Teerapat Noppakun'];
        $roleFor = ['Doctor', 'Manager', 'Business Owner', 'Staff', 'Business Director', 'Doctor', 'Staff', 'Manager', 'Doctor', 'Staff', 'Business Director', 'Doctor', 'Manager', 'Staff', 'Doctor', 'Business Owner', 'Staff', 'Manager', 'Doctor', 'Staff'];
        $statusFor = ['active', 'active', 'active', 'inactive', 'active', 'active', 'active', 'inactive', 'active', 'active', 'active', 'inactive', 'active', 'active', 'active', 'active', 'inactive', 'active', 'active', 'active'];

        foreach ($names as $i => $name) {
            $parts = explode(' ', strtolower($name));
            $uname = $parts[0] . '.' . (isset($parts[1]) ? $parts[1][0] : 'x');
            $day = str_pad((string) (($i * 3) % 28 + 1), 2, '0', STR_PAD_LEFT);
            $hr = str_pad((string) (($i * 7) % 12 + 8), 2, '0', STR_PAD_LEFT);
            $mn = str_pad((string) (($i * 13) % 60), 2, '0', STR_PAD_LEFT);
            $status = $statusFor[$i];

            User::updateOrCreate(
                ['email' => $uname . '@medreco.com'],
                [
                    'name' => $name,
                    'username' => $uname,
                    'password' => Hash::make('password'),
                    'role_id' => $roles->get($roleFor[$i])?->id,
                    'clinic_id' => $clinic?->id,
                    'branch_id' => $branches->isNotEmpty() ? $branches[$i % $branches->count()]->id : null,
                    'status' => $status,
                    'is_super_admin' => false,
                    'created_at' => "2025-05-{$day} {$hr}:{$mn}:00",
                    'last_login_at' => $status === 'active' ? "2025-06-{$day} {$hr}:{$mn}:00" : null,
                ],
            );
        }
    }
}
