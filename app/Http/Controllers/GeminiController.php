<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GeminiController extends Controller
{
    public function ask(Request $request)
    {
        $request->validate([
            'question' => 'required|string',
            'pertanyaan_id' => 'required|integer', 
        ]);

        try {
            $data = DB::table('primm_questions')
                ->join('primms', 'primm_questions.primm_id', '=', 'primms.id')
                ->select(
                    'primm_questions.pertanyaan', 
                    'primm_questions.pembahasan', 
                    'primms.kode_program',
                    'primms.tahap'
                )
                ->where('primm_questions.id', $request->pertanyaan_id)
                ->first();
            if (!$data) {
                return back()->with('error', 'Konteks soal tidak ditemukan di database.');
            }

            $apiKey = env('GEMINI_API_KEY');
            
            $instruksiKhusus = "";
            $tahapLower = strtolower($data->tahap);

            if (str_contains($tahapLower, 'predict')) {
                $instruksiKhusus = "Siswa berada di tahap PREDICT. DILARANG memberikan output kode. Ajak siswa menebak alur jalannya program.";
            } elseif (str_contains($tahapLower, 'modify')) {
                $instruksiKhusus = "Siswa berada di tahap MODIFY. Berikan saran bagian mana yang bisa diubah, jangan beri kode jadi.";
            } elseif (str_contains($tahapLower, 'investigate')) {
                $instruksiKhusus = "Siswa berada di tahap INVESTIGATE. Bantu siswa memahami hubungan antara baris kode dan hasilnya.";
            }

            $systemPrompt = "
                Anda adalah Tutor AI PrimmLearn.
                TAHAPAN BELAJAR: {$data->tahap}
                INSTRUKSI TAHAP: {$instruksiKhusus}
                
                KODE PROGRAM: \"{$data->kode_program}\"
                PERTANYAAN SOAL: \"{$data->pertanyaan}\"
                PEMBAHASAN RAHASIA: \"{$data->pembahasan}\"
                
                TUGAS:
                Berikan bimbingan (scaffolding) sesuai tahapan {$data->tahap}. 
                Gunakan pembahasan rahasia hanya sebagai referensi Anda. 
                Jangan berikan jawaban langsung. Gunakan teknik bertanya balik untuk memicu berpikir kritis.
            ";

            $apiKey = config('services.gemini.key');
            if (!$apiKey) {
                return back()->with('error', 'Waduh! API Key-nya masih kosong di sistem. Coba jalankan php artisan config:clear');
            }

            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $apiKey;

            $response = Http::withoutVerifying()->withHeaders([
                'Content-Type' => 'application/json',
            ])->post($url, [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => $systemPrompt . "\n\nPertanyaan Siswa: " . $request->question]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 1, 
                    'topP' => 0.95,
                    'topK' => 64,
                ]
            ]);

            if ($response->successful()) {
                $jawabanAI = $response->json()['candidates'][0]['content']['parts'][0]['text'];
                
                // Kembali ke cara Inertia yang benar
                return back()->with('aiResponse', $jawabanAI);
            } else {
                Log::error("Gemini API Error: " . $response->body());
                return back()->with('error', 'Gagal memanggil Tutor AI.');
            }

        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return back()->with('error', 'Terjadi kesalahan sistem.');
        }
    }
}
