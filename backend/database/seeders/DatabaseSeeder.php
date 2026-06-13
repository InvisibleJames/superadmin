<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            ClinicSeeder::class,
            BranchSeeder::class,
            UserSeeder::class,
            PatientSeeder::class,
        ]);
    }
}
