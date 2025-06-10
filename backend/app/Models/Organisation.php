<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Organisation extends Model
{
    use HasFactory;

    /**
     * Attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
    ];   

    /**
     * Many-to-many relationship with users.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'organisation_user')
                    ->using(\App\Models\OrganisationUser::class)
                    ->withPivot(['assigned_by', 'assigned_at'])
                    ->withTimestamps();
    }
}
