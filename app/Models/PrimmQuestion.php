<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrimmQuestion extends Model
{
    use HasFactory;

    // Nama tabel di database
    protected $table = 'primm_questions';

    // Kolom yang boleh diisi secara massal
    protected $fillable = [
        'primm_id',
        'pertanyaan',
        'pembahasan',
    ];

    /**
     * Relasi Balik ke Model Primm (Induk)
     * Satu pertanyaan dimiliki oleh satu aktivitas PRIMM
     */
    public function primm()
    {
        return $this->belongsTo(Primm::class, 'primm_id');
    }

    /**
     * Relasi ke Jawaban Siswa (Untuk Kelola Nilai)
     * Satu pertanyaan bisa memiliki banyak jawaban dari siswa yang berbeda
     */
    public function answers()
    {
        return $this->hasMany(StudentAnswer::class, 'primm_question_id');
    }

    public function course()
    {

        return $this->primm->course(); 
    }
}