<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\PrimmActivity;

class Course extends Model
{
  protected $table = 'courses';

  protected $fillable = [
    'title',
    'description',
    'category_id',
    'link',
    'file'
  ];

  public function category()
  {
    return $this->belongsTo(Category::class);
  }

  public function primms()
  {
      return $this->hasMany(Primm::class, 'course_id');
  }
}
