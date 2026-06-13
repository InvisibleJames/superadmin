<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['clinics', 'branches'] as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->string('postal_code', 10)->nullable()->after('subdistrict');
            });
        }
    }

    public function down(): void
    {
        foreach (['clinics', 'branches'] as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->dropColumn('postal_code');
            });
        }
    }
};
