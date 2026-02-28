<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
  public function index(Request $request)
    {
      $search = $request->input('search');

      $users = User::query()
          ->when($search, function ($query) use ($search) {
              $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
          })
          ->where('role', 'siswa')
          ->orderBy('name')
          ->paginate(10)
          ->withQueryString();

      return Inertia::render('guru/list-siswa', [
          'users' => $users,
          'filters' => [
              'search' => $search,
          ],
      ]);
    }
}