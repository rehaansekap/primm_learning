<?php

namespace App\Http\Controllers\Dashboard;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Test;
use App\Models\User;
use App\Models\Primm;
use App\Models\StudentAnswer;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function statistikGuru(Request $request)
    {
        $totalSiswa = User::where('role', 'siswa')->count();

        $totalMateri = Course::count();

        $totalAktivitas = Primm::distinct('course_id')->count('course_id');

        return Inertia::render('guru/dashboard', [
            'stats' => [
                'totalSiswa'            => (int) $totalSiswa,
                'totalAktivitas'        => (int) $totalAktivitas,
                'totalMateri'           => (int) $totalMateri,
            ]
        ]);
    }

    public function statistikSiswa(Request $request)
    {
        $user = $request->user();

        $totalMateriBerpenilaian = \App\Models\Course::has('primms')->count();

        $totalSkorSiswa = \App\Models\StudentAnswer::where('user_id', $user->id)->sum('skor');
        
        $materiYangSudahDikerjakan = \App\Models\Course::whereHas('primms.questions.answers', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->count();

        $materiYangSudahDinilai = \App\Models\Course::whereHas('primms.questions.answers', function ($q) use ($user) {
            $q->where('user_id', $user->id)
            ->where('skor', '>', 0); 
        })->count();

        $hasilAkhir = $materiYangSudahDinilai > 0 
        ? (int) round($totalSkorSiswa / $materiYangSudahDinilai) 
        : 0;

        $totalMateri = \App\Models\Course::count();
        $progresSiswa = $materiYangSudahDikerjakan;

        return Inertia::render('siswa/dashboard', [
            'stats' => [
                'totalAktivitas' => (int) $totalMateriBerpenilaian,
                'totalMateri'    => (int) $totalMateri,
                'progresSiswa'   => (int) $progresSiswa,
                'hasilAkhir'     => $hasilAkhir, 
            ]
        ]);
    }
}
