<?php

namespace App\Http\Controllers;
namespace App\Http\Controllers\Grading; 

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Course;        
use App\Models\User;           
use App\Models\StudentAnswer;  
use App\Models\CourseProgress;

class GradingController extends Controller
{
    public function index()
    {
        $totalMateriTersedia = Course::count(); 

        $students = User::where('role', 'siswa')
            ->withCount('courseProgress') 
            ->get()
            ->map(function ($user) use ($totalMateriTersedia) {
                
                $jawaban = StudentAnswer::where('user_id', $user->id)
                    ->with('question.primm')
                    ->get();

                // Hitung fase PRIMM unik yang sudah dikerjakan siswa
                $faseCount = $jawaban->map(fn($a) => $a->question->primm->tahap ?? null)
                    ->filter()->unique()->count();

                return [
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    
                    'materi_selesai' => $user->course_progress_count . ' / ' . $totalMateriTersedia,
                    
                    'total_fase' => $faseCount . ' / 5',
                    
                    'rata_rata_nilai' => round($jawaban->avg('skor'), 1) ?: 0
                ];
            });

        return Inertia::render('guru/nilai/daftarNilai', ['students' => $students]);
    }

    public function show($userId)
    {
        $answers = StudentAnswer::with(['question.primm.course'])
        ->where('user_id', $userId)
        ->get();

        return Inertia::render('guru/nilai/detailJawaban', [
            'student' => \App\Models\User::find($userId),
            'answers' => $answers
        ]);
    }

    public function bulkUpdate(Request $request, $userId)
    {
        $scores = $request->input('scores', []);
        $feedbacks = $request->input('feedbacks', []);

        $allAnswerIds = array_unique(array_merge(array_keys($scores), array_keys($feedbacks)));

        foreach ($allAnswerIds as $answerId) {
            $dataToUpdate = [];

            if (isset($scores[$answerId])) {
                $dataToUpdate['skor'] = $scores[$answerId];
            }

            if (isset($feedbacks[$answerId])) {
                $dataToUpdate['feedback'] = $feedbacks[$answerId];
            }

            if (!empty($dataToUpdate)) {
                \App\Models\StudentAnswer::where('id', $answerId)
                    ->where('user_id', $userId) 
                    ->update($dataToUpdate);
            }
        }

        return redirect('/guru/nilai/daftarNilai');
    }
}