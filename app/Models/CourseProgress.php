<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class CourseProgress extends Model {
    // Memberitahu model ini untuk membaca tabel course_progress di database
    protected $table = 'course_progress'; 
    protected $fillable = ['user_id', 'course_id'];

    
}