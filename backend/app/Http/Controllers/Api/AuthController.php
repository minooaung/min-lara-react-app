<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{  

    public function signup(SignupRequest $request)
    {
        $data = $request->validated();
        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']) 
        ]);

        $token = $user->createToken('main')->plainTextToken;

        // return response([
        //     'user' => $user, 
        //     'token' => $token
        // ]);

        return response(compact('user', 'token'));
    }

    public function login(LoginRequest $request)
    {
        Log::info('Incoming Headers:', $request->headers->all());
        Log::info('Incoming Cookies:', $request->cookies->all());

        // Log::info('CSRF Token:', ['token' => $request->header('X-XSRF-TOKEN')]);
        // Log::info('CSRF Cookie:', ['cookie' => $request->cookie('XSRF-TOKEN')]);

        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'Provided email address or password is incorrect'
            ], 422);
        }

        /** @var User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;

        return response(compact('user', 'token'));
    }

    public function logout(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        $user->currentAccessToken()->delete();

        return response('', 204);
    }
}
