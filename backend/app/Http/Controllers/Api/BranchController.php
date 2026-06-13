<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BranchResource;
use App\Models\Branch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BranchController extends Controller
{
    /** Columns that may be sorted from the UI. */
    private const SORTABLE = [
        'name' => 'name',
        'status' => 'status',
        'created' => 'created_at',
    ];

    public function index(Request $request): JsonResponse
    {
        $query = Branch::query()->with('clinic');

        $this->applyFilters($query, $request);

        $sort = $request->string('sort')->toString();
        $dir = $request->string('dir')->lower()->toString() === 'asc' ? 'asc' : 'desc';
        $column = self::SORTABLE[$sort] ?? 'created_at';
        $query->orderBy($column, $dir)->orderBy('id', 'desc');

        $perPage = max(1, min((int) $request->integer('per_page', 10), 100));

        return BranchResource::collection($query->paginate($perPage)->withQueryString())->response();
    }

    public function stats(Request $request): JsonResponse
    {
        $base = Branch::query();
        $this->applyFilters($base, $request, includeStatus: false);

        return response()->json([
            'total' => (clone $base)->count(),
            'active' => (clone $base)->where('status', 'active')->count(),
            'inactive' => (clone $base)->where('status', 'inactive')->count(),
            'clinics' => (clone $base)->distinct('clinic_id')->count('clinic_id'),
        ]);
    }

    public function show(Branch $branch): BranchResource
    {
        return new BranchResource($branch->load('clinic'));
    }

    public function store(Request $request): JsonResponse
    {
        $branch = Branch::create($this->validateBranch($request));

        return (new BranchResource($branch->load('clinic')))->response()->setStatusCode(201);
    }

    public function update(Request $request, Branch $branch): BranchResource
    {
        $branch->update($this->validateBranch($request, $branch));

        return new BranchResource($branch->load('clinic'));
    }

    public function destroy(Branch $branch): JsonResponse
    {
        $branch->delete();

        return response()->json(['message' => 'Branch deleted.']);
    }

    public function bulk(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'action' => ['required', Rule::in(['activate', 'deactivate', 'delete'])],
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:branches,id'],
        ]);

        $query = Branch::whereIn('id', $validated['ids']);

        $affected = match ($validated['action']) {
            'activate' => $query->update(['status' => 'active']),
            'deactivate' => $query->update(['status' => 'inactive']),
            'delete' => $query->delete(),
        };

        return response()->json(['message' => "{$affected} branch(es) updated.", 'affected' => $affected]);
    }

    private function applyFilters($query, Request $request, bool $includeStatus = true): void
    {
        if ($q = trim((string) $request->string('q'))) {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('code', 'like', "%{$q}%")
                    ->orWhere('province', 'like', "%{$q}%")
                    ->orWhereHas('clinic', fn ($c) => $c->where('name', 'like', "%{$q}%"));
            });
        }

        if ($includeStatus && ($status = $request->string('status')->toString()) && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($clinicId = $request->integer('clinic_id')) {
            $query->where('clinic_id', $clinicId);
        }
    }

    private function validateBranch(Request $request, ?Branch $branch = null): array
    {
        return $request->validate([
            'clinic_id' => ['required', 'exists:clinics,id'],
            'code' => ['required', 'string', 'max:255', Rule::unique('branches', 'code')->ignore($branch)],
            'name' => ['required', 'string', 'max:255'],
            'province' => ['nullable', 'string', 'max:255'],
            'district' => ['nullable', 'string', 'max:255'],
            'subdistrict' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:10'],
            'phone' => ['nullable', 'string', 'max:64'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);
    }
}
