<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $exception)
    {
        // Handle Unauthorized (RBAC violations)
        if ($exception instanceof AuthorizationException) {
            return response()->json(['error' => 'Unauthorized action. You do not have permission to perform this request.'], 403);
        }

        // Handle Not Found (Missing Resources)
        if ($exception instanceof ModelNotFoundException) {
            return response()->json(['error' => 'Resource not found.'], 404);
        }

        // Handle Validation Errors (Form Submission Issues)
        if ($exception instanceof ValidationException) {
            return response()->json(['error' => 'Invalid input.', 'details' => $exception->errors()], 422);
        }

        // Handle General HTTP Exceptions (e.g., 500 errors)
        if ($exception instanceof HttpException) {
            return response()->json(['error' => $exception->getMessage()], $exception->getStatusCode());
        }

        // Catch-all for unexpected errors
        return response()->json(['error' => 'An unexpected error occurred. Please try again later.'], 500);
    }
}
