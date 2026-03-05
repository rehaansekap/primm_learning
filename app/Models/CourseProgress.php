<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class CourseProgress extends Model {
    protected $table = 'course_progress'; 
    protected $fillable = ['user_id', 'course_id'];

    
}