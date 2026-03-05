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
        ->withTrashed()
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

    public function restore($id) {
        User::withTrashed()->findOrFail($id)->restore();
        return back();
    }

    public function destroy(User $user)
    {
        $user->delete(); 

        return back()->with('success', 'Siswa berhasil dinonaktifkan (arsip).');
    }

    public function forceDestroy($id)
    {
        $user = User::withTrashed()->findOrFail($id);

        $user->forceDelete(); 

        return back()->with('success', 'Data uji coba berhasil dihapus permanen.');
    }
}