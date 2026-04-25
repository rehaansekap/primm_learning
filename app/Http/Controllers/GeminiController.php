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
                ->select('primm_questions.pembahasan', 'primms.tahap')
                ->where('primm_questions.id', $request->pertanyaan_id)
                ->first();

            if (!$data) {
                return back()->with('error', 'Konteks soal tidak ditemukan.');
            }

            // 1. Ambil key dan acak urutannya
            $apiKeys = array_filter([
                env('GEMINI_API_KEY'),
                env('GEMINI_API_KEY_2'),
                env('GEMINI_API_KEY_3'),
            ]);

            if (empty($apiKeys)) {
                return back()->with('error', 'API Key kosong di .env');
            }

            shuffle($apiKeys);

            $systemPrompt = "Role: Tutor AI PrimmLearn. Tahap: {$data->tahap}. Ref: \"{$data->pembahasan}\". Rules: 1. Awali respon dengan PERTANYAAN. 2. Max 2 kalimat. 3. DILARANG beri kode/analogi (kecuali MODIFY/MAKE). 4. Jika tanya hasil: tanya balik alur. 5. Mentok? Beri 1 kata kunci.";

            $jawabanAI = null;

            // 2. LOOPING: Mencoba satu per satu sampai berhasil
            foreach ($apiKeys as $apiKey) {

                $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=" . $apiKey;

                $response = Http::withoutVerifying()
                    ->timeout(30)
                    ->post($url, [
                        'contents' => [
                            ['role' => 'user', 'parts' => [['text' => $systemPrompt . "\n\nPertanyaan Siswa: " . $request->question]]]
                        ],
                        'generationConfig' => [
                            'temperature' => 0.7,
                            'maxOutputTokens' => 300,
                        ]
                    ]);

                // 3. CEK SUKSES: Jika berhasil, ambil jawaban dan BERHENTI (break) dari loop
                if ($response->successful()) {
                    $resData = $response->json();
                    if (isset($resData['candidates'][0]['content']['parts'][0]['text'])) {
                        $jawabanAI = $resData['candidates'][0]['content']['parts'][0]['text'];
                        break; // SUKSES! Jangan coba key berikutnya.
                    }
                } else {
                    // Jika gagal (429/limit), catat ke log dan biarkan loop lanjut ke $apiKey berikutnya
                    Log::warning("API Key Limit, mencoba key cadangan... Status: " . $response->status());
                }
            }

            // 4. KEMBALIKAN RESPONS
            if ($jawabanAI) {
                return back()->with('aiResponse', $jawabanAI);
            }

            // Jika semua pintu (key) tertutup
            return back()->with('error', 'Tutor sedang sangat ramai, coba pelajari dari materi saja yaa!');

        } catch (\Exception $e) {
            Log::error("Sistem Error: " . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan sistem.');
        }
    }
}