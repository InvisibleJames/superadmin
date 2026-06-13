<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /** Columns that may be sorted from the UI. */
    private const SORTABLE = [
        'name' => 'name',
        'status' => 'status',
        'created' => 'created_at',
    ];

    /**
     * Paginated, filterable, sortable list for the Users Management table.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query()->with(['role', 'clinic', 'branch']);

        $this->applyFilters($query, $request);

        $sort = $request->string('sort')->toString();
        $dir = $request->string('dir')->lower()->toString() === 'asc' ? 'asc' : 'desc';
        $column = self::SORTABLE[$sort] ?? 'created_at';
        $query->orderBy($column, $dir)->orderBy('id', 'desc');

        $perPage = (int) $request->integer('per_page', 10);
        $perPage = max(1, min($perPage, 100));

        $users = $query->paginate($perPage)->withQueryString();

        return UserResource::collection($users)->response();
    }

    /**
     * Aggregate counts for the stat cards. Honours the same filters as the list
     * minus status, so the breakdown stays meaningful.
     */
    public function stats(Request $request): JsonResponse
    {
        $base = User::query();
        $this->applyFilters($base, $request, includeStatus: false);

        $total = (clone $base)->count();
        $active = (clone $base)->where('status', 'active')->count();
        $inactive = (clone $base)->where('status', 'inactive')->count();
        $roles = \App\Models\Role::count();
        $lastImport = User::max('created_at');

        return response()->json([
            'total' => $total,
            'active' => $active,
            'inactive' => $inactive,
            'roles' => $roles,
            'last_import' => $lastImport,
        ]);
    }

    public function show(User $user): UserResource
    {
        return new UserResource($user->load(['role', 'clinic', 'branch']));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateUser($request);
        $data['password'] = Hash::make($data['password'] ?? 'password');

        $user = User::create($data);

        return (new UserResource($user->load(['role', 'clinic', 'branch'])))
            ->response()
            ->setStatusCode(201);
    }

    public function update(Request $request, User $user): UserResource
    {
        $data = $this->validateUser($request, $user);

        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return new UserResource($user->load(['role', 'clinic', 'branch']));
    }

    public function destroy(User $user): JsonResponse
    {
        abort_if($user->is_super_admin, 422, 'The Super Admin account cannot be deleted.');

        $user->delete();

        return response()->json(['message' => 'User deleted.']);
    }

    /**
     * Bulk activate / deactivate / delete from the table toolbar.
     */
    public function bulk(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'action' => ['required', Rule::in(['activate', 'deactivate', 'delete'])],
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:users,id'],
        ]);

        $query = User::whereIn('id', $validated['ids']);

        $affected = match ($validated['action']) {
            'activate' => $query->update(['status' => 'active']),
            'deactivate' => $query->update(['status' => 'inactive']),
            'delete' => $query->where('is_super_admin', false)->delete(),
        };

        return response()->json([
            'message' => "{$affected} user(s) updated.",
            'affected' => $affected,
        ]);
    }

    private function applyFilters($query, Request $request, bool $includeStatus = true): void
    {
        if ($q = trim((string) $request->string('q'))) {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%")
                    ->orWhere('phone', 'like', "%{$q}%")
                    ->orWhere('username', 'like', "%{$q}%");
            });
        }

        if ($includeStatus && ($status = $request->string('status')->toString()) && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($roleId = $request->integer('role_id')) {
            $query->where('role_id', $roleId);
        }

        if ($clinicId = $request->integer('clinic_id')) {
            $query->where('clinic_id', $clinicId);
        }

        if ($branchId = $request->integer('branch_id')) {
            $query->where('branch_id', $branchId);
        }
    }

    private function validateUser(Request $request, ?User $user = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:255', Rule::unique('users', 'username')->ignore($user)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user)],
            'phone' => ['nullable', 'string', 'max:64'],
            'password' => [$user ? 'nullable' : 'nullable', 'string', 'min:6'],
            'role_id' => ['nullable', 'exists:roles,id'],
            'clinic_id' => ['nullable', 'exists:clinics,id'],
            'branch_id' => ['nullable', 'exists:branches,id'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);
    }
}
