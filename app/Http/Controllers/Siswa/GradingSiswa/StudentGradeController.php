<?php

namespace App\Http\Controllers\Siswa\GradingSiswa;

use App\Http\Controllers\Controller; 
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

use App\Models\Course;             
use App\Models\StudentAnswer;
use App\Models\CourseProgress;

class StudentGradeController extends Controller
{
    public function index()
    {
        $userId = Auth::id(); 

        $allCourses = \App\Models\Course::all();

        $allAnswers = \App\Models\StudentAnswer::with(['question.primm'])
            ->where('user_id', $userId)
            ->get();

        $results = $allCourses->map(function ($course) use ($allAnswers) {
            $jawabanMateriIni = $allAnswers->filter(function ($answer) use ($course) {
                return $answer->question?->primm?->course_id === $course->id;
            });

            $faseCount = $jawabanMateriIni->map(fn($a) => $a->question?->primm?->tahap ?? null)
                ->filter()
                ->unique()
                ->count();

            $totalNilaiMateri = $jawabanMateriIni->sum('skor');

            $firstAnswer = $jawabanMateriIni->first();

            return [
                'id' => $course->id, 
                'title' => $course->title, 
                'total_fase' => $faseCount, 
                'total_skor_materi' => round($totalNilaiMateri) ?: 0, 
                'is_pengenalan' => str_contains(strtolower($course->title), 'pengenalan'),
            ];
        });

        return Inertia::render('siswa/nilaiSiswa/hasilBelajar', [
            'results' => $results
        ]);
    }

    public function show($id)
    {
        $userId = Auth::id(); 
        $course = \App\Models\Course::findOrFail($id);

        $reports = \App\Models\StudentAnswer::with(['question.primm'])
            ->where('user_id', $userId)
            ->whereHas('question.primm', function($q) use ($id) {
                $q->where('course_id', $id);
            })
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('siswa/nilaiSiswa/detailHasil', [
            'reports' => $reports,
            'course_title' => $course->title 
        ]);
    }
}