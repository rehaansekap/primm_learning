<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use App\Models\Course;
use App\Models\Category;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $categories = Category::all();

        $courses = Course::with('category')->get();

        return Inertia::render('guru/course/list-materi', [
            'categories' => $categories,
            'courses' => $courses,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
          'title' => 'required|string',
          'category_id' => 'required',
          'description' => 'required|string',
          'link'        => 'nullable|url',
          'file'        => 'nullable',
        ]);

        Course::create($validated);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, $id)
    {
        $course = Course::with('category')->findOrFail($id);
        
        return Inertia::render('guru/course/content-materi', [
          'materi' => [
              'id' => $course->id,
              'judul' => $course->title,
              'kategori' => $course->category?->name ?? '',
              'deskripsi' => $course->description,
              'link' => $course->link ?? '',
              'file' => $course->file ?? '',
          ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        //
    }

    /**
     * Update course content (link or file)
     */
    public function updateContent(Request $request, Course $course)
    {
        $validated = $request->validate([
            'tipe_konten' => 'required|in:link,file',
            'embed_code' => 'nullable|string',
            'file_materi' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        if ($request->tipe_konten === 'link') {
            $course->update(['link' => $request->embed_code, 'file' => null]);
        } else {
            if ($request->hasFile('file_materi')) {
                // Delete old file if exists
                if ($course->file) {
                    Storage::disk('public')->delete($course->file);
                }
                $path = $request->file('file_materi')->store('courses', 'public');
                $course->update(['file' => $path, 'link' => null]);
            }
        }

        return redirect()
          ->route('course.index')
          ->with('success', 'Konten berhasil disimpan');

    }

    public function preview(Course $course)
    {
      abort_if(!$course->file, 404);

      return response()->file(
          storage_path('app/public/' . $course->file)
      );
    }
}
