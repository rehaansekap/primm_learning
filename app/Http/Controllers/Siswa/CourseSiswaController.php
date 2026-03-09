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

       $courseData = [
            'id' => $course->id,
            'title' => $course->title,
            'description' => $course->description,
            'link' => $course->link,
            'file' => $course->file,
            'link_drive' => $course->link_drive, 
        ];

        if (str_contains(strtolower($course->title), 'pengenalan')) {
            return Inertia::render('siswa/courseSiswa/showCourse', ['course' => $courseData]);
        }

        $primmData = $course->primms->groupBy('tahap');

        return Inertia::render('siswa/courseSiswa/showPrimm', [
            'course' => $courseData,
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

         $isAllFinished = DB::table('course_progress')
        ->where('user_id', $userId)
        ->where('course_id', $id)
        ->exists();    

        return Inertia::render('siswa/courseSiswa/showPrimm', [

        'course' => [
            'id' => $course->id,
            'title' => $course->title,
            'description' => $course->description, 
            'link' => $course->link,
            'file' => $course->file,
            'link_drive' => $course->link_drive,
        ],
        'primm' => $primmData,
        'activeStepFromUrl' => $step,
        'existingAnswers' => $existingAnswers,
        'isAllFinished' => $isAllFinished
    ]);
    }

    public function saveProgress(Request $request)
    {
        $request->validate(['jawaban' => 'required|array']);

        try {
            $userId = Auth::id();
            
            collect($request->input('jawaban'))->each(function ($teks, $questionId) use ($userId) {
                if (!empty($teks)) {
                    StudentAnswer::updateOrCreate(
                        ['user_id' => $userId, 'primm_question_id' => $questionId],
                        ['jawaban_siswa' => $teks]
                    );
                }
            });

            return back()->with('success', 'Jawaban terkunci dan pembahasan terbuka!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal: ' . $e->getMessage());
        }
    }

    public function listPrimm($id)
    {
        $course = Course::findOrFail($id);
        $userId = Auth::id();
        $steps = ['predict', 'run', 'investigate', 'modify', 'make'];
        $progress = [];

        foreach ($steps as $step) {
            $isCompleted = \App\Models\StudentAnswer::where('user_id', $userId)
                ->whereHas('question.primm', function($query) use ($id, $step) {
                    $query->where('course_id', $id)->where('tahap', $step);
                })->exists();
                
            $progress[$step] = $isCompleted;
        }

        $isAllFinished = DB::table('course_progress')
        ->where('user_id', $userId)
        ->where('course_id', $id)
        ->exists();

        return Inertia::render('siswa/courseSiswa/listPrimm', [
            'course' => $course,
            'progress' => $progress, 
            'isAllFinished' => $isAllFinished
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

        return back()->with('success', 'Selamat! Materi telah selesai.');
        
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memproses penyelesaian: ' . $e->getMessage());
        }
    }
}
