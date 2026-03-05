<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrimmQuestion extends Model
{
    use HasFactory;

    protected $table = 'primm_questions';

    protected $fillable = [
        'primm_id',
        'pertanyaan',
        'pembahasan',
    ];

    public function primm()
    {
        return $this->belongsTo(Primm::class, 'primm_id');
    }

    public function answers()
    {
        return $this->hasMany(StudentAnswer::class, 'primm_question_id');
    }

    public function course()
    {

        return $this->primm->course(); 
    }
}