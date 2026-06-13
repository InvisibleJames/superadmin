<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Thai address cascade: amphoe (district) + tambon (subdistrict) alongside
    // the existing province on clinics and branches.
    public function up(): void
    {
        foreach (['clinics', 'branches'] as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->string('district')->nullable()->after('province');
                $t->string('subdistrict')->nullable()->after('district');
            });
        }
    }

    public function down(): void
    {
        foreach (['clinics', 'branches'] as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->dropColumn(['district', 'subdistrict']);
            });
        }
    }
};
