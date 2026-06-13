<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('hn')->unique();          // hospital number, e.g. HN-650148
            $table->string('name');
            $table->enum('gender', ['Male', 'Female'])->nullable();
            $table->unsignedTinyInteger('age')->nullable();
            $table->foreignId('clinic_id')->nullable()->constrained('clinics')->nullOnDelete();
            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->string('phone')->nullable();
            $table->date('last_visit_at')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->index('status');
            $table->index('gender');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
