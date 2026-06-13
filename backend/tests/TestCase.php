<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Sanctum\Sanctum;

abstract class TestCase extends BaseTestCase
{
    /**
     * Authenticate as a Super Admin for API requests and return the user.
     */
    protected function actingAsAdmin(): User
    {
        $admin = User::factory()->superAdmin()->create();
        Sanctum::actingAs($admin, ['*']);

        return $admin;
    }
}
