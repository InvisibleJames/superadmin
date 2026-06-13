<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clinics', function (Blueprint $table) {
            // Denormalised patient tally shown on the Clinics screen. Populated
            // by the seeder until the Patients module lands.
            $table->unsignedInteger('patients_count')->default(0)->after('province');
        });
    }

    public function down(): void
    {
        Schema::table('clinics', function (Blueprint $table) {
            $table->dropColumn('patients_count');
        });
    }
};
