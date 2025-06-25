<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
        $organisation = Organisation::findOrFail($id); // Ensures Laravel handles the 404 exception automatically
        return new OrganisationResource($organisation);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrgRequest $request)
    {
        $data = $request->validated();
        $organisation = Organisation::create($data);
    }    

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrgRequest $request, int $id)
    {
        $organisation = Organisation::findOrFail($id);
        $data = $request->validated();
        $organisation->update($data);

        return new OrganisationResource($organisation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
