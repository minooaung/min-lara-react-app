<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

use App\Http\Resources\UserResource;
use Auth;
use Hash;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');

        $users = User::select(['id', 'name', 'email', 'role', 'created_at']) // Fetch only needed columns
            ->when(!empty($search), function ($query) use ($search) {  // Ensure search is not null
            return $query->where('id', intval($search))
                            ->orWhere('name', 'LIKE', "%{$search}%")
                            ->orWhere('email', 'LIKE', "%{$search}%");
        })
        ->orderBy("id","desc")
        ->paginate(10); // Use pagination to avoid loading too many users at once

        return UserResource::collection($users);
    }

    /**
     * Display the specified resource.
     */    
    public function show($id)
    {
        // $user = User::find($id);
        // if (!$user) {
        //     return response()->json(['error' => 'User not found'], 404);
        // }

        $user = User::findOrFail($id); // 🔥 Ensures Laravel handles the 404 exception automatically
    
        return new UserResource($user);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $this->authorize('create', User::class);

        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        $data['role'] = $data['role'] ?? 'EMPLOYEE';

        if ($data['role'] === 'ADMIN' && User::where('role', 'ADMIN')->count() >= 5) {
            return response()->json(['error' => 'Cannot create ADMIN user. System already has Maximum limit of 5 Admin Users.'], 403);
        }

        $user = User::create($data);
        return new UserResource($user);
    }
    // public function store(StoreUserRequest $request)
    // {
    //     try {
    //         $this->authorize('create', User::class); 

    //         \Log::info("Creating a new user");
            
    //         // Validate incoming data
    //         $data = $request->validated();
    
    //         // Ensure password is securely hashed
    //         //$data['password'] = bcrypt($data['password']);
    //         $data['password'] = Hash::make($data['password']);
            
    //         // Default role assignment (EMPLOYEE unless explicitly specified)
    //         //$data['role'] = $data['role'] ?? 'EMPLOYEE';

    //         // Explicitly check if role is present, otherwise default to EMPLOYEE
    //         if (!isset($data['role']) || empty($data['role'])) {
    //             \Log::info("No role provided, defaulting to EMPLOYEE.");
    //             $data['role'] = 'EMPLOYEE';
    //         } else {
    //             \Log::info("Role from request: " . $data['role']);
    //         }

    //         // Enforce ADMIN limit (max 5)
    //         if ($data['role'] === 'ADMIN' && User::where('role', 'ADMIN')->count() >= 5) {
    //             \Log::warning("ADMIN creation limit reached.");
    //             return response()->json([
    //                 'error' => 'Cannot create more than 5 ADMIN users. Please assign a different role or manage existing ADMIN accounts.'
    //             ], 403);
    //         }
    
    //         // Attempt user creation
    //         $user = User::create($data);
    //         \Log::info("Created a new user with name: " . $data['name'] . " and role: " . $data['role']);

    //         return response()->json([
    //             'message' => 'User created successfully',
    //             'user' => new UserResource($user),
    //         ], 201); // ✅ Use 201 Created for successful resource creation
    
    //         // Return a success response with the created user
    //         //return new UserResource($user);
    //     } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
    //         \Log::warning("Unauthorized attempt to create a user.");
    //         return response()->json(['error' => 'Unauthorized action'], 403); // Handle RBAC restrictions

    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         \Log::warning("Validation failed: " . json_encode($e->errors()));
    //         return response()->json(['error' => 'Invalid input', 'details' => $e->errors()], 422); // Handle validation errors

    //     } catch (\Exception $e) {
    //         \Log::error("Unexpected error creating user: " . $e->getMessage());
    //         return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500); // More precise failure response
    //     }
    //     // } catch (\Exception $e) {
    //     //     \Log::error("Error creating user: " . $e->getMessage()); // Logs actual error message
    //     //     return response()->json(['error' => 'Failed to create user'], 500);
    //     // }
    // }    

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, $id)
    {
        \Log::info("Updating a user with ID: " . $id);

        // Retrieve user or return 404 if not found
        $user = User::findOrFail($id);

        // Check authorization (prevent unauthorized updates)
        $this->authorize('update', $user);

        // Validate the input data
        $data = $request->validated();

        // Handle password updates securely
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        // Attempt user update
        $user->update($data);

        \Log::info("User updated successfully: " . $user->name);

        return new UserResource($user);
        // return response()->json([
        //     'message' => 'User updated successfully',
        //     'user' => new UserResource($user),
        // ], 200);
    }

    // public function update(UpdateUserRequest $request, $id)
    // {
    //     try {
    //         \Log::info("Updating a user with id: " . $id);

    //         // Retrieve user or return 404 if not found
    //         $user = User::findOrFail($id); 

    //         // Check authorization (prevent unauthorized updates)
    //         $this->authorize('update', $user);

    //          // Validate the input data
    //         $data = $request->validated();

    //         // Handle password updates securely
    //         if (isset($data['password'])) {
    //             $data['password'] = Hash::make($data['password']);
    //         }
            
    //         // Attempt user update
    //         if (!$user->update($data)) {
    //             \Log::error("User update failed for ID: " . $id);
    //             return response()->json(['error' => 'Failed to update user'], 500);
    //         }

    //         // Return successful response
    //         return response()->json([
    //             'message' => 'User updated successfully',
    //             'user' => new UserResource($user),
    //         ], 200);
    //     } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
    //         \Log::warning("Unauthorized update attempt for user ID: " . $id);
    //         return response()->json(['error' => 'Unauthorized action'], 403); // Returns RBAC failure response

    //     } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
    //         \Log::error("User not found with ID: " . $id);
    //         return response()->json(['error' => 'User not found'], 404); //  Returns clear "User not found" error

    //     } catch (\Exception $e) {
    //         \Log::error("Unexpected error updating user ID: " . $id . " | " . $e->getMessage());
    //         return response()->json(['error' => 'An unexpected error occurred. Please try again later.'], 500); // ✅ Provides a safer generic error
    //     }
    // }


    /**
     * Remove the specified resource from storage.
     */

    public function destroy($id)
    {
        \Log::info("Attempting to delete user ID: " . $id);

        // Retrieve user or return 404 if not found
        $user = User::findOrFail($id);

        // Enforce RBAC policy-based authorization
        $this->authorize('delete', $user);

        // Check for potential foreign key constraints
        if ($user->organisationUsers()->count() > 0) {
            \Log::warning("User ID: {$id} has associated records and cannot be deleted.");
            return response()->json([
                'error' => 'User cannot be deleted due to existing relationships.'
            ], 409); // Use 409 Conflict when deletion is blocked by DB constraints
        }

        // Attempt user deletion
        $user->delete();

        \Log::info("User ID {$id} successfully deleted.");

        return response()->json([
            'message' => 'User deleted successfully'
        ], 200);
    }

    // public function destroy($id)
    // {
    //     try {
    //         \Log::info("Attempting to delete user ID: " . $id);

    //         // Retrieve user or return a clear 404 response if not found
    //         $user = User::findOrFail($id);

    //         // Enforce RBAC policy-based authorization
    //         $this->authorize('delete', $user);

    //         // Check for potential foreign key constraints
    //         if ($user->organisationUsers()->count() > 0) {
    //             \Log::warning("User ID: {$id} has associated records and cannot be deleted.");
    //             return response()->json([
    //                 'error' => 'User cannot be deleted due to existing relationships.'
    //             ], 409); // Use 409 Conflict when deletion is blocked by DB constraints
    //         }

    //         // Attempt user deletion
    //         $user->delete();

    //         \Log::info("User ID {$id} successfully deleted.");
    //         return response()->json(['message' => 'User deleted successfully'], 200); // Use 200 OK for a successful deletion

    //     } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
    //         \Log::warning("Unauthorized deletion attempt for user ID: " . $id);
    //         return response()->json(['error' => 'Unauthorized action'], 403); // Clear RBAC response

    //     } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
    //         \Log::error("User ID: " . $id . " not found.");
    //         return response()->json(['error' => 'User not found'], 404); // Returns precise error for missing users

    //     } catch (\Exception $e) {
    //         \Log::error("Unexpected error deleting user ID {$id} | " . $e->getMessage());
    //         return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500); // Provides a detailed failure message
    //     }
    // }


    // public function destroy($id)
    // {
    //     try {
    //         \Log::info("Deleting a user with id: " . $id);

    //         //$user = User::find($id);
    //         $user = User::findOrFail($id);

    //         $this->authorize('delete', $user); // Enforce policy-based authorization

    //         // Prevent ADMIN from deleting another ADMIN
    //         // if ($user->role === 'ADMIN') {
    //         //     return response()->json(['error' => 'Deleting ADMIN users is not allowed'], 403);
    //         // }
    //         // Prevent self-deletion
    //         // if (Auth::id() === $user->id) {
    //         //     return response()->json(['error' => 'You cannot delete yourself'], 403);
    //         // }

    //         // Attempt to delete the user
    //         $user->delete();
    
    //         // Return a 204 No Content response
    //         return response("", 204);
    //     } catch (\Exception $e) {
    //         \Log::error("Error deleting user: " . $e->getMessage());    
    //         return response()->json(['error' => 'Failed to delete user'], 500);
    //     }
    // }
}
