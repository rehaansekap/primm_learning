import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { usePage, Link } from '@inertiajs/react';
import { Lock, BookOpen, CheckCircle, ChevronRight } from 'lucide-react';

export default function ListCourse() {
    const { courses, completedCourseIds } = usePage<any>().props;

    return (
        <AppLayout>
            <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-50/50">
                
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Materi Pembelajaran
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Pilih modul sesuai urutan yang akan pelajari hari ini.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course: any, index: number) => {
                        const isFirst = index === 0;
                        const previousCourse = !isFirst ? courses[index - 1] : null;
                        
                        const isPreviousDone = isFirst || (previousCourse && completedCourseIds.includes(previousCourse.id));
                        const isLocked = !isPreviousDone; 
                        const isDone = completedCourseIds.includes(course.id);

                        return (
                            <div 
                                key={course.id} 
                                className={`group relative bg-white rounded-[2rem] p-6 transition-all duration-300 border-2 
                                    ${isLocked 
                                        ? 'border-gray-100 bg-gray-50/50 cursor-not-allowed' 
                                        : 'border-[#78B9B5] hover:border-[#24A0ED]/30 hover:shadow-xl hover:-translate-y-1 shadow-sm'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-2xl ${isLocked ? 'bg-gray-200' : 'bg-[#24A0ED]/10'}`}>
                                        {isLocked ? (
                                            <Lock className="w-6 h-6 text-gray-400" />
                                        ) : isDone ? (
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        ) : (
                                            <BookOpen className="w-6 h-6 text-[#24A0ED]" />
                                        )}
                                    </div>
                                    {isDone && (
                                        <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase tracking-wider">
                                            Selesai
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                    <h3 className={`text-xl font-bold leading-tight ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                                        {course.title}
                                    </h3>
                                    <p className={`text-sm line-clamp-2 ${isLocked ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {course.description || 'Pelajari materi ini untuk meningkatkan keahlianmu dalam bidang ini.'}
                                    </p>
                                </div>

                                {/* Progress Indicator */}
                                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center text-xs font-medium text-gray-400">
                                        <BookOpen className="w-4 h-4 mr-1.5" />
                                        Modul {index + 1}
                                    </div>

                                    {!isLocked ? (
                                        <Link 
                                            href={course.title === 'Pengenalan' 
                                                ? `/siswa/courseSiswa/showCourse/${course.id}` 
                                                : `/siswa/courseSiswa/listPrimm/${course.id}`
                                            }
                                           className="flex items-center gap-1 text-sm font-bold text-[#24A0ED] hover:text-[#1d82c2] transition-colors pl-3"
                                        >
                                            {isDone ? 'Lihat Lagi' : 'Mulai Belajar'}
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-1 text-sm font-bold text-gray-300">
                                            Terkunci
                                            <Lock className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>

                                {!isLocked && (
                                    <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/0 via-white/0 to-[#24A0ED]/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}