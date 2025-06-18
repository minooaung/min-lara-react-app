<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function create(User $authUser)
    {
        //return $authUser->role === 'ADMIN' && User::where('role', 'ADMIN')->count() < 5;

        // if ($authUser->role !== 'ADMIN') {
        //     return false;
        // }
        // // Avoid unnecessary query calls
        // return User::where('role', 'ADMIN')->count() < 5;

        // Allow ADMINs to create users, but enforce the max limit inside the policy
        // if ($authUser->role === 'ADMIN') {
        //     return User::where('role', 'ADMIN')->count() < 5; // ✅ Return true or false instead of aborting
        // }

        // return false; // ❌ Prevents EMPLOYEES from creating users

        // Allow ADMIN to create users (RBAC check only)
        return $authUser->role === 'ADMIN';
    }

    public function update(User $authUser, User $targetUser)
    {
        // Allow users to update their own profiles
        if ($authUser->id === $targetUser->id) {
            return true;
        }

        // Allow ADMIN to update EMPLOYEE users, but not other ADMINs
        return $authUser->role === 'ADMIN' && $targetUser->role !== 'ADMIN';
    }

    public function delete(User $authUser, User $targetUser)
    {
        //return $authUser->role === 'ADMIN' && $user->role === 'EMPLOYEE' && $authUser->id !== $user->id;

        // $authUser->role !== 'ADMIN' >> Restricts deletion to ADMIN users only. Ensures EMPLOYEE users cannot delete anyone
        // $user->role !== 'EMPLOYEE' >> Prevents deletion of ADMIN users. Ensures ADMINs can only delete EMPLOYEE accounts. Protects ADMIN accounts from unauthorized removal
        // $authUser->id === $user->id >> Prevents self-deletion. Ensures an ADMIN cannot delete their own account. Prevents accidental lockout (where no ADMIN exists to manage users)
        // Returning true if all conditions pass       
        // if ($authUser->role !== 'ADMIN' || $user->role !== 'EMPLOYEE' || $authUser->id === $user->id) {
        //     return false;
        // }

        // return true;

        // This ensures that only an ADMIN can delete an EMPLOYEE, and not themselves or another ADMIN
        // This policy method checks if the authenticated user is an ADMIN, the target user is an EMPLOYEE, and they are not trying to delete themselves

        if ($authUser->id === $targetUser->id) {
            return false; // Prevent self-deletion
        }

        return $authUser->role === 'ADMIN' && $targetUser->role !== 'ADMIN';
    }
}

