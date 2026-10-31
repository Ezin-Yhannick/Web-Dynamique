<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'service' => 'pharmacies']);
});

Route::get('/pharmacies', function (Request $request) {
    return response()->json([
        [
            'code' => 'PH-COT-04',
            'nom' => "Pharmacie de l'étoile",
            'commune' => 'Cotonou',
            'agreee' => true
        ]
    ]);
});

Route::get('/pharmacies/{code}', function ($code) {
    if ($code === 'PH-COT-04') {
        return response()->json([
            'code' => 'PH-COT-04',
            'nom' => "Pharmacie de l'étoile",
            'commune' => 'Cotonou',
            'agreee' => true
        ]);
    }
    return response()->json(['error' => 'Pharmacie introuvable'], 404);
});
