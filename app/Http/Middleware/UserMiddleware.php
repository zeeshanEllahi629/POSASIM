<?php

namespace App\Http\Middleware;

use Closure;
use Auth;
use App\Helpers\helper;

class UserMiddleware
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
        if(!file_exists(storage_path() . "/installed")) {
            return redirect('install');
            exit;
        }
        
        helper::language();

        if (Auth::user() ){
            if(Auth::user()->type=="2") {
                return $next($request);
            }else{
                return redirect()->back();
            }
        }
        Auth::logout();
        return redirect('/');
    }
}
