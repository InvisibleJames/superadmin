<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clinics', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();       // e.g. "C101"
            $table->string('no')->nullable();        // legacy clinic number
            $table->string('name');
            $table->string('province')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->index('status');
            $table->index('province');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clinics');
    }
};
