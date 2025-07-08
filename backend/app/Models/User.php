<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Organisation;
use App\Models\OrganisationUser;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // Ensure role is included in fillable attributes
    ];

    /**
     * Attributes that should be hidden in arrays or JSON.
     */
    protected $hidden = [
        'password'
    ];

    /**
     * Casts for attributes.
     */
    protected $casts = [
        'password' => 'hashed',
    ];

    /**
     * Role check helpers (optional but useful)
     */
    public function isAdmin(): bool
    {
        return $this->role === 'ADMIN';
    }

    public function isEmployee(): bool
    {
        return $this->role === 'EMPLOYEE';
    }

    /**
     * Many-to-many relationship with organisations.
     */
    public function organisations()
    {
        return $this->belongsToMany(Organisation::class, 'organisation_user')
                    ->using(OrganisationUser::class)
                    ->withPivot(['assigned_by'])
                    ->withTimestamps();
    }

    public function organisationUsers()
    {
        return $this->hasMany(OrganisationUser::class, 'assigned_by'); // ✅ Define the relationship
    }
}

//-------------------------------------------------------

// namespace App\Models;

// // use Illuminate\Contracts\Auth\MustVerifyEmail;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Foundation\Auth\User as Authenticatable;
// use Illuminate\Notifications\Notifiable;
// use Laravel\Sanctum\HasApiTokens;

// class User extends Authenticatable
// {
//     use HasApiTokens, HasFactory, Notifiable;

//     /**
//      * The attributes that are mass assignable.
//      *
//      * @var array<int, string>
//      */
//     protected $fillable = [
//         'name',
//         'email',
//         'password',
//     ];

//     /**
//      * The attributes that should be hidden for serialization.
//      *
//      * @var array<int, string>
//      */
//     protected $hidden = [
//         'password',
//         'remember_token',
//     ];

//     /**
//      * The attributes that should be cast.
//      *
//      * @var array<string, string>
//      */
//     protected $casts = [
//         'email_verified_at' => 'datetime',
//         'password' => 'hashed',
//     ];
// }