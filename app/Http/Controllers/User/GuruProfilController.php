<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuruProfilController extends Controller
{

    public function edit(Request $request)
    {
        return Inertia::render('edit-profil', [
            'user' => $request->user(),
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'  => 'required|string|max:255',
            'jk'    => 'required|in:L,P',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($request->only('name', 'jk', 'email'));

        // Redirect dinamis: Jika role 'guru' ke /guru/dashboard, jika 'siswa' ke /siswa/dashboard
        return redirect()->to('/' . $user->role . '/dashboard')
                        ->with('success', 'Profil berhasil diperbarui');
    }
}
