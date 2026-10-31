<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'service' => 'medecins']);
});

Route::get('/medecins', function (Request $request) {
    return response()->json([
        [
            'numero' => 'ONMB-2015-0412',
            'nom' => 'HOUNSOU',
            'prenoms' => 'Koffi',
            'specialite' => 'Médecine générale',
            'statut' => 'actif'
        ]
    ]);
});

Route::get('/medecins/{numero}', function ($numero) {
    if ($numero === 'ONMB-2015-0412') {
        return response()->json([
            'numero' => 'ONMB-2015-0412',
            'nom' => 'HOUNSOU',
            'prenoms' => 'Koffi',
            'specialite' => 'Médecine générale',
            'statut' => 'actif'
        ]);
    }
    return response()->json(['error' => 'Médecin introuvable'], 404);
});
