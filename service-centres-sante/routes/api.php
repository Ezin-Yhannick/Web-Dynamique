<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'service' => 'centres-sante']);
});

Route::get('/centres', function (Request $request) {
    return response()->json([
        [
            'code' => 'CS-AKP-01',
            'libelle' => "Centre de santé d'Akpakpa",
            'type' => 'centre de santé',
            'commune' => 'Cotonou',
            'agree' => true
        ]
    ]);
});

Route::get('/centres/{code}', function ($code) {
    if ($code === 'CS-AKP-01') {
        return response()->json([
            'code' => 'CS-AKP-01',
            'libelle' => "Centre de santé d'Akpakpa",
            'type' => 'centre de santé',
            'commune' => 'Cotonou',
            'agree' => true
        ]);
    }
    return response()->json(['error' => 'Centre introuvable'], 404);
});
