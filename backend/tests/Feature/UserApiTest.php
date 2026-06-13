<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_is_paginated(): void
    {
        $this->actingAsAdmin();
        User::factory()->count(15)->create();

        $this->getJson('/api/users?per_page=10')
            ->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonStructure(['data', 'meta' => ['total', 'last_page', 'current_page']]);
    }

    public function test_index_filters_by_search_query(): void
    {
        $this->actingAsAdmin();
        User::factory()->create(['name' => 'Findme Unique']);
        User::factory()->count(3)->create();

        $this->getJson('/api/users?q=Findme')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.name', 'Findme Unique');
    }

    public function test_index_filters_by_status(): void
    {
        $this->actingAsAdmin();
        User::factory()->count(2)->create(['status' => 'active']);
        User::factory()->inactive()->count(3)->create();

        // +1 active admin from actingAsAdmin().
        $this->getJson('/api/users?status=inactive')
            ->assertOk()
            ->assertJsonPath('meta.total', 3);
    }

    public function test_stats_returns_counts(): void
    {
        $this->actingAsAdmin();
        User::factory()->count(4)->create(['status' => 'active']);
        User::factory()->inactive()->count(2)->create();

        $this->getJson('/api/users/stats')
            ->assertOk()
            ->assertJsonPath('inactive', 2)
            ->assertJsonStructure(['total', 'active', 'inactive', 'roles']);
    }

    public function test_store_creates_a_user(): void
    {
        $this->actingAsAdmin();
        $role = Role::create(['name' => 'Doctor', 'slug' => 'doctor', 'hue' => 'teal', 'level' => 3]);

        $this->postJson('/api/users', [
            'name' => 'New Person',
            'email' => 'new.person@medreco.com',
            'role_id' => $role->id,
            'status' => 'active',
        ])->assertCreated()->assertJsonPath('data.email', 'new.person@medreco.com');

        $this->assertDatabaseHas('users', ['email' => 'new.person@medreco.com']);
    }

    public function test_update_changes_status(): void
    {
        $this->actingAsAdmin();
        $user = User::factory()->create(['status' => 'active']);

        $this->putJson("/api/users/{$user->id}", [
            'name' => $user->name,
            'email' => $user->email,
            'status' => 'inactive',
        ])->assertOk()->assertJsonPath('data.status', 'inactive');
    }

    public function test_destroy_deletes_a_user(): void
    {
        $this->actingAsAdmin();
        $user = User::factory()->create();

        $this->deleteJson("/api/users/{$user->id}")->assertOk();
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_super_admin_cannot_be_deleted(): void
    {
        $this->actingAsAdmin();
        $protected = User::factory()->superAdmin()->create();

        $this->deleteJson("/api/users/{$protected->id}")->assertStatus(422);
        $this->assertDatabaseHas('users', ['id' => $protected->id]);
    }

    public function test_bulk_deactivate(): void
    {
        $this->actingAsAdmin();
        $users = User::factory()->count(3)->create(['status' => 'active']);

        $this->postJson('/api/users/bulk', [
            'action' => 'deactivate',
            'ids' => $users->pluck('id')->all(),
        ])->assertOk()->assertJsonPath('affected', 3);

        $this->assertSame(3, User::whereIn('id', $users->pluck('id'))->where('status', 'inactive')->count());
    }
}
