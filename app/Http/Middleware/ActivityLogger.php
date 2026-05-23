<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class ActivityLogger
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $module
     * @param  string  $action
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $module = 'System', $action = 'Accessed')
    {
        $response = $next($request);

        // Only log successful actions (e.g. GET for index, POST for store, etc.) or just log everything
        if (Auth::check() && $request->method() !== 'GET') {
            $log = new ActivityLog();
            $log->user_id = Auth::id();
            $log->module = $module;
            
            // Map common actions based on method if not explicitly provided
            if ($action === 'Accessed') {
                if ($request->isMethod('post')) $action = 'Created/Updated';
                elseif ($request->isMethod('put') || $request->isMethod('patch')) $action = 'Updated';
                elseif ($request->isMethod('delete')) $action = 'Deleted';
            }

            $log->action = $action;
            $log->description = 'Action performed on ' . $request->path();
            $log->ip_address = $request->ip();
            $log->user_agent = $request->userAgent();
            $log->save();
        }

        return $response;
    }
}
