<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sa_users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->enum('admin_role', ['Super Admin', 'Admin', 'Support', 'Auditor', 'Read-only'])->default('Admin');
            $table->boolean('two_fa')->default(false);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamp('last_active_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('admin_role');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sa_users');
    }
};
