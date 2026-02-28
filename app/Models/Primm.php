<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Primm extends Model
{
    protected $table = 'primms';

    protected $fillable = [
        'course_id',
        'tahap',
        'gambar',
        'link_colab',
    ];

    protected $casts = [
        'soal' => 'array',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function questions() 
    {
        return $this->hasMany(PrimmQuestion::class, 'primm_id');
    }
}
