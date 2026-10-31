<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'service' => 'anip']);
});

Route::get('/citoyens/{npi}', function ($npi) {
    if ($npi === '9912345678') {
        return response()->json([
            'npi' => '9912345678',
            'nom' => 'AHOUANDJINOU',
            'prenoms' => 'Rita',
            'date_naissance' => '1990-04-17',
            'sexe' => 'F',
            'commune' => 'Cotonou'
        ]);
    }
    return response()->json(['error' => 'NPI inconnu'], 404);
});
