<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->unique()->after('name');
            $table->string('phone')->nullable()->after('email');
            $table->foreignId('role_id')->nullable()->after('phone')->constrained('roles')->nullOnDelete();
            $table->foreignId('clinic_id')->nullable()->after('role_id')->constrained('clinics')->nullOnDelete();
            $table->foreignId('branch_id')->nullable()->after('clinic_id')->constrained('branches')->nullOnDelete();
            $table->enum('status', ['active', 'inactive'])->default('active')->after('branch_id');
            $table->boolean('is_super_admin')->default(false)->after('status');
            $table->timestamp('last_login_at')->nullable()->after('is_super_admin');

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('role_id');
            $table->dropConstrainedForeignId('clinic_id');
            $table->dropConstrainedForeignId('branch_id');
            $table->dropColumn(['username', 'phone', 'status', 'is_super_admin', 'last_login_at']);
        });
    }
};
