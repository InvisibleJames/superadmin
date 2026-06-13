<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();      // e.g. "Business Owner"
            $table->string('slug')->unique();       // e.g. "business-owner"
            $table->string('hue', 32)->default('neutral'); // badge tone: amber/teal/violet/blue
            $table->unsignedSmallInteger('level')->default(0); // ordering Owner -> Staff
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
