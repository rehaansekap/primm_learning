<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentAnswer;
use Illuminate\Support\Facades\Redirect;

class CourseSiswaController extends Controller
{
    public function index()
    {
        $courses = Course::orderBy('id', 'asc')->get();
        
        $completedCourseIds = DB::table('course_progress')
            ->where('user_id', Auth::id()) 
            ->pluck('course_id')
            ->toArray();

        return Inertia::render('siswa/courseSiswa/listCourse', [
            'courses' => $courses,
            'completedCourseIds' => $completedCourseIds
        ]);
    }

    public function show($id)
    {
       $course = Course::with(['primms.questions'])->findOrFail($id);

        if (str_contains(strtolower($course->title), 'pengenalan')) {
            return Inertia::render('siswa/courseSiswa/showCourse', ['course' => $course]);
        }

        $primmData = $course->primms->groupBy('tahap');

        return Inertia::render('siswa/courseSiswa/showPrimm', [
            'course' => $course,
            'primm' => $primmData
        ]);
    }

    public function showPrimm($id, $step)
    {
        $course = Course::with(['primms.questions'])->findOrFail($id);
        $primmData = $course->primms->groupBy('tahap');
        $userId = Auth::id();

        $existingAnswers = \App\Models\StudentAnswer::where('user_id', $userId)
            ->whereHas('question.primm', function($query) use ($id) {
                $query->where('course_id', $id);
            })
            ->pluck('jawaban_siswa', 'primm_question_id'); 

        return Inertia::render('siswa/courseSiswa/showPrimm', [
            'course' => $course,
            'primm' => $primmData,
            'activeStepFromUrl' => $step,
            'existingAnswers' => $existingAnswers 
        ]);
}

    public function saveProgress(Request $request)
    {
        $request->validate([
            'jawaban' => 'required|array', 
        ]);

        try {
            $userId = Auth::id();
            $jawabanSiswa = $request->input('jawaban'); 
            foreach ($jawabanSiswa as $questionId => $teksJawaban) {
                if (!empty($teksJawaban)) {
                    \App\Models\StudentAnswer::updateOrCreate(
                        [
                            'user_id' => $userId,
                            'primm_question_id' => $questionId,
                        ],
                        [
                            'jawaban_siswa' => $teksJawaban,
                            
                        ]
                    );
                }
            }

            return back()->with('success', 'Jawaban berhasil disimpan!');

        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menyimpan: ' . $e->getMessage());
        }
    }

    public function listPrimm($id)
    {
        $course = Course::findOrFail($id);
        $userId = Auth::id();
        $steps = ['predict', 'run', 'investigate', 'modify', 'make'];
        $progress = [];

        foreach ($steps as $step) {
            // Cek apakah ada jawaban siswa yang terhubung ke soal di tahap ini
            $isCompleted = \App\Models\StudentAnswer::where('user_id', $userId)
                ->whereHas('question.primm', function($query) use ($id, $step) {
                    $query->where('course_id', $id)->where('tahap', $step);
                })->exists();
                
            $progress[$step] = $isCompleted;
        }

        return Inertia::render('siswa/courseSiswa/listPrimm', [
            'course' => $course,
            'progress' => $progress 
        ]);
    }

    public function complete($id)
    {
        try {
            $userId = Auth::id();
            $course = Course::with('primms')->findOrFail($id);

            $hasPrimm = $course->primms->count() > 0;

            if ($hasPrimm) {
                
                $steps = ['predict', 'run', 'investigate', 'modify', 'make'];
                
                foreach ($steps as $step) {
                    $isStepDone = \App\Models\StudentAnswer::where('user_id', $userId)
                        ->whereHas('question.primm', function($query) use ($id, $step) {
                            $query->where('course_id', $id)->where('tahap', $step);
                        })->exists();

                    if (!$isStepDone) {
                        return back()->with('error', "Tahap " . ucfirst($step) . " belum diselesaikan.");
                    }
                }
            }

            DB::table('course_progress')->updateOrInsert(
                ['user_id' => $userId, 'course_id' => $id],
                ['created_at' => now(), 'updated_at' => now()]
            );

        return Redirect::route('siswa.course.index')->with('success', 'Selamat! Materi telah selesai.');

        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memproses penyelesaian: ' . $e->getMessage());
        }
    }
}
