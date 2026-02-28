<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentAnswer extends Model
{
    protected $table = 'student_answers';
    
    protected $fillable = [
        'user_id', 
        'primm_question_id', 
        'jawaban_siswa', 
        'skor', 
        'feedback'
    ];
    protected $casts = [
        'jawaban' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function question()
    {
        return $this->belongsTo(PrimmQuestion::class, 'primm_question_id');
    }
}
