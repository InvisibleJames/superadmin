<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // The Patients module now provides a real per-clinic count via withCount,
    // so the denormalised placeholder column is no longer needed.
    public function up(): void
    {
        Schema::table('clinics', function (Blueprint $table) {
            $table->dropColumn('patients_count');
        });
    }

    public function down(): void
    {
        Schema::table('clinics', function (Blueprint $table) {
            $table->unsignedInteger('patients_count')->default(0)->after('province');
        });
    }
};
