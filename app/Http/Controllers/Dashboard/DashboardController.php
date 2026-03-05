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
        
        $siswaSelesai = User::where('role', 'siswa')
            ->whereHas('answers.question.primm', function ($query) {
                $query->select('course_id')
                    ->groupBy('course_id')
                    ->havingRaw('COUNT(DISTINCT tahap) >= 5');
            })->count();

        return Inertia::render('guru/dashboard', [
            'stats' => [
                'totalSiswa'            => (int) $totalSiswa,
                'totalAktivitas'        => (int) $totalAktivitas,
                'totalMateri'           => (int) $totalMateri,
                'siswaSelesaiSemuaFase' => (int) $siswaSelesai,
            ]
        ]);
    }

    public function statistikSiswa(Request $request)
    {
        $user = $request->user();

        $totalMateriBerpenilaian = \App\Models\Course::has('primms')->count();

        $totalSkorSiswa = \App\Models\StudentAnswer::where('user_id', $user->id)->sum('skor');

        $hasilAkhir = $totalMateriBerpenilaian > 0 
            ? (int) round($totalSkorSiswa / $totalMateriBerpenilaian) 
            : 0;

        $totalMateri = \App\Models\Course::count();
        $progresSiswa = \App\Models\Course::whereHas('primms.questions.answers', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->count();

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
