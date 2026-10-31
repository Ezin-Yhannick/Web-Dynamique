<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'api-dmp'
    ]);
});

Route::get('/status', function () {
    return response()->json([
        'status' => 'DMP API operational',
        'version' => '1.0.0',
        'timestamp' => now()->toIso8601String()
    ]);
});
