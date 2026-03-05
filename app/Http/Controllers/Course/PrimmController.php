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

        // 1. Ambil semua ID blok yang dikirim dari form
        $incomingBlockIds = collect($blocks)->pluck('id')->filter()->toArray();

        \App\Models\Primm::where('course_id', $materiId)
            ->where('tahap', $tahap)
            ->whereNotIn('id', $incomingBlockIds)
            ->delete();

        foreach ($blocks as $index => $data) {
            // Simpan atau update data PRIMM (Blok)
            $primm = \App\Models\Primm::updateOrCreate(
                ['id' => (isset($data['id']) && $data['id'] < 1000000000000) ? $data['id'] : null],
                [
                    'course_id' => $materiId,
                    'tahap'     => $tahap,
                    'link_colab' => $data['link_colab'] ?? null,
                    'gambar'     => $request->hasFile("gambar_{$index}") 
                        ? $request->file("gambar_{$index}")->store("primm/{$tahap}", 'public') 
                        : ($data['existing_gambar'] ?? null),
                ]
            );

            // 3. Sinkronisasi Pertanyaan (Logika Anda sudah benar di sini)
            $incomingQuestionIds = collect($data['pertanyaan'] ?? [])
                ->pluck('id')
                ->filter()
                ->toArray();

            // Hapus pertanyaan yang tidak ada di form (untuk blok ini)
            $primm->questions()->whereNotIn('id', $incomingQuestionIds)->delete();

            if (isset($data['pertanyaan']) && is_array($data['pertanyaan'])) {
                foreach ($data['pertanyaan'] as $qData) {
                    $teks = $qData['teks'] ?? '';
                    $pembahasan = $qData['pembahasan'] ?? ''; 

                    if (!empty(trim($teks))) {
                        $primm->questions()->updateOrCreate(
                            ['id' => (isset($qData['id']) && $qData['id'] < 1000000000000) ? $qData['id'] : null],
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