<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $searchString = $request->query('search');

        $users = User::where(function($query) use ($searchString) {
                $query->where('id', 'like', "%{$searchString}%")
                    ->orWhere('name', 'like', "%{$searchString}%")
                    ->orWhere('email', 'like', "%{$searchString}%");
            })
            ->orderBy("id","desc")
            ->paginate(10);

//        return UserResource::collection(
//            User::query()->orderBy('id', 'desc')->paginate(10)
//        );

        //print_r(UserResource::collection($users));exit;

        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(StoreUserRequest $request)
    // {
    //     $data = $request->validated();
    //     $data['password'] = bcrypt($data['password']);
    //     $user = User::create($data);    
    //     return response(new UserResource($user), 201);
    // }

    public function store(StoreUserRequest $request)
    {
        try {
            \Log::info("Creating a new user");
            
            $data = $request->validated();
    
            // Hash the password before saving
            $data['password'] = bcrypt($data['password']);
    
            // Create the user
            $user = User::create($data);
    
            // Return a success response with the created user
            return new UserResource($user);
    
        } catch (\Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'Failed to create user'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    // public function show(User $user)
    // {
    //     return new UserResource($user);
    // }
    
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
    
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     */
    // public function update(UpdateUserRequest $request, User $user)
    // {
    //     $data = $request->validated();
    //     if (isset($data['password'])) {
    //         $data['password'] = bcrypt($data['password']);
    //     }
    //     $user->update($data);
    //     return new UserResource($user);
    // }

    public function update(UpdateUserRequest $request, $id)
    {
        try {
            \Log::info("Updating a user with id: " . $id);

            $user = User::find($id);

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            $data = $request->validated();

            if (isset($data['password'])) {
                $data['password'] = bcrypt($data['password']);
            }

            $user->update($data);

            return new UserResource($user);
        } catch (\Exception $e) {
            // Log the error and return a 500 Internal Server Error response
            \Log::error("Failed to update user: " . $e->getMessage());
    
            return response()->json(['error' => 'Failed to update user'], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    // public function destroy(User $user)
    // {
    //     $user->delete();
    //     return response("", 204);
    // }

    public function destroy($id)
    {
        try {
            \Log::info("Deleting a user with id: " . $id);

            $user = User::find($id);
            // Attempt to delete the user
            $user->delete();
    
            // Return a 204 No Content response
            return response("", 204);
        } catch (\Exception $e) {
            // Log the error and return a 500 Internal Server Error response
            \Log::error("Failed to delete user: " . $e->getMessage());
    
            return response()->json(['error' => 'Failed to delete user'], 500);
        }
    }
}
