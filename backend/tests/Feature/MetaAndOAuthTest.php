<?php

namespace Tests\Feature;

use App\Models\Clinic;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MetaAndOAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_meta_returns_reference_data(): void
    {
        $this->actingAsAdmin();
        Role::create(['name' => 'Doctor', 'slug' => 'doctor', 'hue' => 'teal', 'level' => 3]);
        Clinic::factory()->create(['province' => 'Bangkok']);

        $this->getJson('/api/meta')
            ->assertOk()
            ->assertJsonStructure([
                'roles', 'clinics', 'branches', 'provinces', 'genders', 'admin_roles', 'statuses',
            ]);
    }

    public function test_oauth_redirect_is_graceful_when_unconfigured(): void
    {
        config()->set('services.authentik.base_url', '');
        config()->set('services.authentik.client_id', null);

        $this->get('/auth/oauth/redirect')
            ->assertRedirect();

        $this->assertStringContainsString('error=oauth_unconfigured', $this->lastRedirect());
    }

    public function test_oauth_redirect_builds_authorize_url_when_configured(): void
    {
        config()->set('services.authentik.base_url', 'https://id.example.com');
        config()->set('services.authentik.client_id', 'med-client');
        config()->set('services.authentik.redirect', 'http://localhost:8000/auth/oauth/callback');

        $location = $this->get('/auth/oauth/redirect')->headers->get('Location');

        $this->assertStringStartsWith('https://id.example.com/application/o/authorize/', $location);
        $this->assertStringContainsString('client_id=med-client', $location);
        $this->assertStringContainsString('response_type=code', $location);
    }

    private function lastRedirect(): string
    {
        return (string) $this->get('/auth/oauth/redirect')->headers->get('Location');
    }
}
