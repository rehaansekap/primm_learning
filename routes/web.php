<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\User\GuruProfilController;
use App\Http\Controllers\Test\TestController;
use App\Http\Controllers\Course\CourseController;
use App\Http\Controllers\Course\PrimmController;
use App\Http\Controllers\Siswa\CourseSiswaController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Grading\GradingController;
use App\Http\Controllers\Siswa\GradingSiswa\StudentGradeController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/guru/dashboard', [DashboardController::class, 'statistikGuru'])
    ->middleware(['auth', 'verified'])->name('guru-dashboard');

Route::get('/siswa/dashboard', [DashboardController::class, 'statistikSiswa'])
    ->middleware(['auth', 'verified'])->name('siswa-dashboard');

Route::get('/dashboard', function () {
    /** @var \App\Models\User $user */
    $user = Auth::user(); 

    if (!$user) {
        return redirect()->route('login');
    }

    return match ($user->role) {
        'guru'  => redirect()->route('guru-dashboard'),
        'siswa' => redirect()->route('siswa-dashboard'),
        default => abort(403),
    };
})->middleware('auth');

Route::get('/register', [RegisterController::class, 'create'])
    ->name('register.create');
Route::post('/register', [RegisterController::class, 'store'])
    ->name('register');

Route::middleware('auth')->group(function () {
    Route::get('/edit-profil', [GuruProfilController::class, 'edit'])->name('profile.edit');
    Route::put('/update-profil', [GuruProfilController::class, 'update'])->name('profile.update');
});

Route::get('/tentang', function () {
    return Inertia::render('about'); 
});

Route::get('/kontak', function () {
    return Inertia::render('contact');
});

Route::get('/petunjuk', function () {
    return Inertia::render('petunjuk');
});

Route::get('guru/list-siswa', [UserController::class, 'index'])
    ->name('users.index');

Route::get('guru/test/kelolaTest', function () {
    return Inertia::render('guru/test/kelolaTest');
});

Route::get('guru/test/form-tambahTest', function () {
    return Inertia::render('guru/test/form-tambahTest');
});

Route::prefix('guru/test')->name('guru.test.')->group(function () {
    Route::get('/', [TestController::class, 'index'])->name('index');
    Route::get('/form-tambah', [TestController::class, 'create'])->name('create');
    Route::post('/', [TestController::class, 'store'])->name('store');

    Route::get('/{id}/edit', [TestController::class, 'edit'])->name('edit');
    Route::put('/{id}', [TestController::class, 'update'])->name('update');
    Route::delete('/{id}', [TestController::class, 'destroy'])->name('destroy');
});

Route::post('/guru/course/tambah-materi', [CourseController::class, 'store'])
    ->name('course.store');

Route::get('/guru/course', [CourseController::class, 'index'])
    ->name('course.index');

Route::get('/course/preview/{course}', [CourseController::class, 'preview'])
    ->middleware('auth');

Route::get('/guru/course/{materiId}/primm', function ($materiId) {
    return Inertia::render('guru/course/primm', [
        'materiId' => $materiId
    ]);
});

Route::get('/guru/course/primm/list-primm/{id}', [PrimmController::class, 'index'])
    ->name('primm.index');

Route::get('/guru/course/primm/{tahap}/aktivitas', [PrimmController::class, 'edit'])
    ->name('primm.edit');

Route::post('/guru/course/{courseId}/primm/{tahap}/store', [PrimmController::class, 'store'])
    ->name('primm.store');

Route::get('/guru/course/content-materi/{id}', [CourseController::class, 'edit'])
    ->name('course.edit');

Route::post('/guru/course/content-materi/{course}', [CourseController::class, 'updateContent'])
    ->name('course.updateContent');

Route::middleware(['auth'])->group(function () {
    Route::get('/guru/nilai', [GradingController::class, 'index'])->name('grading.index');
    Route::get('/guru/nilai/detail/{userId}', [GradingController::class, 'show'])->name('grading.show');
    Route::put('/grading/{id}', [GradingController::class, 'update'])->name('grading.update');
    Route::post('/grading/bulk-update/{userId}', [GradingController::class, 'bulkUpdate']);

    Route::get('/siswa/nilaiSiswa', [StudentGradeController::class, 'index'])->name('siswa.hasil.index');
    Route::get('/siswa/nilaiSiswa/detailHasil/{id}', [StudentGradeController::class, 'show'])
        ->name('siswa.hasil.show');
});



// Route::get('/guru/course/primm/predict/pembahasan', function () {
//     return Inertia::render('guru/course/primm/PredictPembahasan'); 
// });


//Siswa
// Route::get('siswa/testSiswa/listTest', function () {
    
//     $tests = \App\Models\Test::all(); 

//     return inertia('siswa/testSiswa/listTest', [
//         'tests' => $tests
//     ]);
// })->name('siswa.test.index');

Route::get('siswa/testSiswa', function () {
    
    $tests = \App\Models\Test::all(); 

    return inertia('siswa/testSiswa/listTest', [
        'tests' => $tests
    ]);
})->name('siswa.test.index');

Route::middleware(['auth'])->group(function () {
    Route::get('/siswa/courseSiswa', [CourseSiswaController::class, 'index'])
        ->name('siswa.course.index');
    Route::get('/siswa/courseSiswa/showCourse/{id}', [CourseSiswaController::class, 'show'])
        ->name('siswa.course.show');
    Route::post('/siswa/courseSiswa/complete/{id}', [CourseSiswaController::class, 'complete'])
        ->name('siswa.course.complete');

    Route::get('/siswa/courseSiswa/listPrimm/{id}', [CourseSiswaController::class, 'listPrimm'])
        ->name('siswa.courseSiswa.listPrimm');

    Route::get('/siswa/courseSiswa/showPrimm/{id}/{step}', [CourseSiswaController::class, 'showPrimm'])
    ->name('siswa.courseSiswa.showPrimm');

    Route::post('/siswa/courseSiswa/saveProgress', [CourseSiswaController::class, 'saveProgress'])
        ->name('siswa.course.saveProgress');
});

require __DIR__.'/settings.php';
