<?php

namespace App\Http\Controllers\Test;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Test;
use Inertia\Inertia;

class TestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
      return Inertia::render('guru/test/kelolaTest', [
        'tests' => Test::latest()->get(),
      ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
      return Inertia::render('guru/test/form-tambahTest');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
        'title'       => 'required|string|max:255',
        'description' => 'required|string',
        'link'        => 'required|url',
        ]);

        Test::create($validated);

        return redirect()
            ->route('guru.test.index')
            ->with('success', 'Test berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $test = Test::findOrFail($id);

        return inertia('guru/test/editTest', [
            'test' => $test
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
        'title'       => 'required|string|max:255',
        'description' => 'required|string',
        'link'        => 'required|url',
        ]);

        $test = Test::findOrFail($id);

        $test->update($validated);

        return redirect()->route('guru.test.index')->with('success', 'Test berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $test = Test::findOrFail($id);
    
        // Hapus data
        $test->delete();

        // Redirect kembali
        return redirect()->route('guru.test.index')->with('success', 'Test berhasil dihapus');
        }
}
