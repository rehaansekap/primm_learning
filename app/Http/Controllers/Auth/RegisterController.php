<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;


class RegisterController extends Controller
{
  /**
   * Menampilkan halaman register
   */
  public function create()
  {
      return Inertia::render('auth/register');
  }

  /**
   * Menyimpan data register
   */
  public function store(Request $request)
  {
      $validated = $request->validate([
          'name' => ['required', 'string', 'max:255'],
          'jk' => ['required', 'in:L,P'],
          'email' => ['required', 'email', 'unique:users,email'],
          'role' => ['required', 'in:guru,siswa'],
          'password' => ['required', 'confirmed', 'min:8'],
      ]);

    
      User::create([
          'name' => $validated['name'],
          'jk' => $validated['jk'],
          'email' => $validated['email'],
          'role' => $validated['role'],
          'password' => Hash::make($validated['password']),
      ]);

      return redirect()->route('login')
          ->with('success', 'Akun berhasil dibuat. Silakan login.');
  }
}
