<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Organisation; // Assuming you have an Organisation model
use App\Http\Resources\OrganisationResource; // Assuming you have a resource for Organisation

use App\Http\Requests\StoreOrgRequest;
use App\Http\Requests\UpdateOrgRequest;

class OrganisationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');

        $organisations = Organisation::select(['id', 'name', 'created_at'])
            ->when(!empty($search), function ($query) use ($search) {
                return $query->where('id', intval($search))
                             ->orWhere('name', 'LIKE', "%{$search}%");
            })
            ->orderBy("id", "desc")
            ->paginate(10);

        return OrganisationResource::collection($organisations);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        //$organisation = Organisation::findOrFail($id); // Ensures Laravel handles the 404 exception automatically
        $organisation = Organisation::with('users')->findOrFail($id); // Load users relationship
        return new OrganisationResource($organisation);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrgRequest $request)
    {
        $data = $request->validated();
        $organisation = Organisation::create($data);

        $userIds = $request->input('user_ids', []);
        $assignedBy = Auth::id(); // Get the authenticated user's ID

        $syncData = collect($userIds)->mapWithKeys(function ($userId) use ($assignedBy) {
            return [$userId => ['assigned_by' => $assignedBy]];
        })->toArray();

        $organisation->users()->sync($syncData);
        return new OrganisationResource($organisation->load('users'));
    }    

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrgRequest $request, int $id)
    {
        $organisation = Organisation::findOrFail($id);
        $data = $request->validated();
        $organisation->update($data);

        $userIds = $request->input('user_ids', []);
        $assignedBy = Auth::id(); // Get the authenticated user's ID

        // collect($userIds): wraps the raw array of user IDs (e.g. [78, 79, 80]) into a Laravel Collection.
        // mapWithKeys: iterates over each user ID and creates a key-value pair where the key is the user ID and the value is an array with 'assigned_by'.
        // toArray: converts the Collection back into a plain array.
        $syncData = collect($userIds)->mapWithKeys(function ($userId) use ($assignedBy) {
            return [$userId => ['assigned_by' => $assignedBy]];
        })->toArray();
        // Above will return something like:
        // [
        //   78 => ['assigned_by' => 1],
        //   79 => ['assigned_by' => 1],
        //   80 => ['assigned_by' => 1],
        // ]
        
        $organisation->users()->sync($syncData);
        // Connects the users listed in $syncData to the $organisation.
        // Populates the pivot table (organisation_user) with: organisation_id, user_id, assigned_by, created_at / updated_at (if timestamps are enabled)
        // It also removes any previously assigned users not in the new array, making it a full replacement.

        return new OrganisationResource($organisation->load('users'));
        // Load the users relationship to return the updated organisation with its users
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        DB::transaction(function () use ($id) {
            $organisation = Organisation::findOrFail($id);

            // Detach or delete pivot records
            $organisation->users()->detach(); // or ->sync([]) if you prefer
            // (or you can use sync([]) to remove all associations)
            //$organisation->users()->sync([]); // This will remove all associations with users

            // Delete the organisation
            $organisation->delete();
        });

        return response()->json(['message' => 'Organisation deleted successfully']);
    }
}
