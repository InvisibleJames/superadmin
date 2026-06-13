<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SaUserResource;
use App\Models\SaUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SaUserController extends Controller
{
    private const ADMIN_ROLES = ['Super Admin', 'Admin', 'Support', 'Auditor', 'Read-only'];

    /** Columns that may be sorted from the UI. */
    private const SORTABLE = [
        'name' => 'name',
        'status' => 'status',
        'created' => 'created_at',
        'last_active' => 'last_active_at',
    ];

    public function index(Request $request): JsonResponse
    {
        $query = SaUser::query();

        $this->applyFilters($query, $request);

        $sort = $request->string('sort')->toString();
        $dir = $request->string('dir')->lower()->toString() === 'asc' ? 'asc' : 'desc';
        $column = self::SORTABLE[$sort] ?? 'created_at';
        $query->orderBy($column, $dir)->orderBy('id', 'desc');

        $perPage = max(1, min((int) $request->integer('per_page', 10), 100));

        return SaUserResource::collection($query->paginate($perPage)->withQueryString())->response();
    }

    public function stats(Request $request): JsonResponse
    {
        $base = SaUser::query();
        $this->applyFilters($base, $request, includeStatus: false);

        return response()->json([
            'total' => (clone $base)->count(),
            'active' => (clone $base)->where('status', 'active')->count(),
            'super_admins' => (clone $base)->where('admin_role', 'Super Admin')->count(),
            'two_fa' => (clone $base)->where('two_fa', true)->count(),
        ]);
    }

    public function show(SaUser $saUser): SaUserResource
    {
        return new SaUserResource($saUser);
    }

    public function store(Request $request): JsonResponse
    {
        $saUser = SaUser::create($this->validateSaUser($request));

        return (new SaUserResource($saUser))->response()->setStatusCode(201);
    }

    public function update(Request $request, SaUser $saUser): SaUserResource
    {
        $saUser->update($this->validateSaUser($request, $saUser));

        return new SaUserResource($saUser);
    }

    public function destroy(SaUser $saUser): JsonResponse
    {
        $saUser->delete();

        return response()->json(['message' => 'SA user deleted.']);
    }

    public function bulk(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'action' => ['required', Rule::in(['activate', 'deactivate', 'delete'])],
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:sa_users,id'],
        ]);

        $query = SaUser::whereIn('id', $validated['ids']);

        $affected = match ($validated['action']) {
            'activate' => $query->update(['status' => 'active']),
            'deactivate' => $query->update(['status' => 'inactive']),
            'delete' => $query->delete(),
        };

        return response()->json(['message' => "{$affected} SA user(s) updated.", 'affected' => $affected]);
    }

    private function applyFilters($query, Request $request, bool $includeStatus = true): void
    {
        if ($q = trim((string) $request->string('q'))) {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }

        if ($includeStatus && ($status = $request->string('status')->toString()) && $status !== 'all') {
            $query->where('status', $status);
        }

        if (($role = $request->string('admin_role')->toString()) && $role !== 'all') {
            $query->where('admin_role', $role);
        }
    }

    private function validateSaUser(Request $request, ?SaUser $saUser = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('sa_users', 'email')->ignore($saUser)],
            'admin_role' => ['required', Rule::in(self::ADMIN_ROLES)],
            'two_fa' => ['boolean'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);
    }
}
