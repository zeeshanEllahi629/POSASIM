<?php

namespace App\Http\Middleware;

use Closure;
use App\Helpers\helper;
use Illuminate\Support\Facades\Auth;

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        helper::language();

        if (Auth::user() && in_array(Auth::user()->type, [1, 4])) {
            return $next($request);
        }
        Auth::logout();
        return redirect('admin');
    }
}
