<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Primm;
use App\Models\Course;
use Inertia\Inertia;

class PrimmController extends Controller
{

    public function store(Request $request, $materiId, $tahap)
    {
        $blocks = $request->input('blok');

        foreach ($blocks as $index => $data) {
            
            $primm = \App\Models\Primm::updateOrCreate(
                ['id' => $data['id'] ?? null],
                [
                    'course_id' => $materiId,
                    'tahap'     => $tahap,
                    'link_colab' => $data['link_colab'] ?? null,
                    'gambar'     => $request->hasFile("gambar_{$index}") 
                                    ? $request->file("gambar_{$index}")->store("primm/{$tahap}", 'public') 
                                    : ($data['existing_gambar'] ?? null),
                ]
            );

            $incomingQuestionIds = collect($data['pertanyaan'] ?? [])
                ->pluck('id')
                ->filter()
                ->toArray();

            $primm->questions()->whereNotIn('id', $incomingQuestionIds)->delete();

            if (isset($data['pertanyaan']) && is_array($data['pertanyaan'])) {
                foreach ($data['pertanyaan'] as $qData) {
                    $teks = $qData['teks'] ?? '';
                    $pembahasan = $qData['pembahasan'] ?? ''; 

                    if (!empty($teks)) {
                        $primm->questions()->updateOrCreate(
                            ['id' => $qData['id'] ?? null],
                            [
                                'pertanyaan' => $teks,
                                'pembahasan' => $pembahasan 
                            ]
                        );
                    }
                }
            }
        }

        return back()->with('success', 'Aktivitas berhasil diperbarui!');
    }

    public function index($courseId)
    {
        $course = Course::with('category')->findOrFail($courseId);
        
        $primms = Primm::with('questions')->where('course_id', $courseId)->get();

        $primmData = [
            'predict' => [], 'run' => [], 'investigate' => [], 'modify' => [], 'make' => [],
        ];

        foreach ($primms as $primm) {
            $tahap = $primm->tahap;
            
            $primmData[$tahap][] = [
                'id' => $primm->id,
                'gambar' => $primm->gambar ? '/storage/' . $primm->gambar : null,
                'link_colab' => $primm->link_colab,
                'questions' => $primm->questions, 
            ];
        }

        return Inertia::render('guru/course/primm/list-primm', [
            'materi' => [
                'id' => $course->id,
                'judul' => $course->title,
            ],
            'primm' => $primmData,
        ]);
    }

    public function edit($tahap)
    {
        $courseId = request()->query('course_id');
        $tahapKey = strtolower($tahap);
        
        $primmRecords = Primm::with('questions')
                            ->where('course_id', $courseId)
                            ->where('tahap', $tahapKey)
                            ->get();

        return Inertia::render('guru/course/primm/form-aktivitas', [
            'tahap' => $tahap, 
            'materi' => [
                'id' => $courseId,
                'judul' => request()->query('judul')
            ],
            'primm' => [
                $tahapKey => $primmRecords
            ],
        ]);
    }
}