<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class CourseProgress extends Model {
    protected $table = 'course_progress'; 
    protected $fillable = ['user_id', 'course_id'];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}