<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Role hues fixed by the MedReco design system.
        $roles = [
            ['name' => 'Business Owner',    'hue' => 'amber',  'level' => 1],
            ['name' => 'Business Director', 'hue' => 'teal',   'level' => 2],
            ['name' => 'Doctor',            'hue' => 'teal',   'level' => 3],
            ['name' => 'Manager',           'hue' => 'violet', 'level' => 4],
            ['name' => 'Staff',             'hue' => 'blue',   'level' => 5],
        ];

        foreach ($roles as $r) {
            Role::updateOrCreate(
                ['slug' => Str::slug($r['name'])],
                ['name' => $r['name'], 'hue' => $r['hue'], 'level' => $r['level']],
            );
        }
    }
}
