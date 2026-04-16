import React, { useState } from "react";
import { Head, Link, router } from '@inertiajs/react'; 
import { ArrowLeft, CheckCircle, Download, CheckCircle2 } from "lucide-react"; 
import AppLayout from '@/layouts/app-layout';

export default function ShowCourse({ course }: { course: any }) {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    const convertYoutubeToEmbed = (url: string): string => {
        if (!url) return '';
        if (url.includes('<iframe')) return url;
        let videoId = '';
        if (url.includes('v=')) videoId = url.split('v=')[1]?.split('&')[0];
        else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
        
        return videoId 
            ? `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>` 
            : url;
    };

    const handleComplete = () => {
        router.post(`/siswa/courseSiswa/complete/${course.id}`, {}, {
            preserveState: true, 
            onSuccess: () => {
                setShowSuccessModal(true);
            },
            onError: (errors) => {
                console.error(errors);
                alert("Terjadi kesalahan saat menyelesaikan materi.");
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: course.title, href: '#' }]} hideSidebar>
            <Head title={course.title} />
            
            <div className="h-screen bg-[#F8FAFC] font-sans text-gray-800 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white px-6 py-3 shadow-sm border-b border-gray-100 flex-shrink-0">
                    <h1 className="text-lg text-blue-600 font-bold uppercase tracking-tighter">{course.title}</h1>
                    <p className="text-gray-400 text-xs">{course.category?.name || 'Materi Umum'}</p>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-h-0 overflow-auto p-6 flex items-center justify-center">
                    <div className="w-full max-w-4xl">
                        {course.link ? (
                            <div 
                                className="w-full h-[550px]"
                                dangerouslySetInnerHTML={{ __html: convertYoutubeToEmbed(course.link) }} 
                            />
                        ) : course.file ? (
                            <div className="w-full flex items-center justify-center">
                                {course.file.endsWith('.pdf') ? (
                                    <iframe src={`/storage/${course.file}`} className="w-full h-[550px] rounded-lg border border-gray-200" />
                                ) : (
                                    <img src={`/storage/${course.file}`} className="w-full rounded-lg shadow-sm" alt="Materi" />
                                )}
                            </div>
                        ) : (
                            <div className="text-gray-400 uppercase font-bold text-xs tracking-widest text-center">
                                Tidak ada media untuk materi ini
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="bg-white px-6 py-3 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
                    <Link 
                        href="/siswa/courseSiswa" 
                        className="px-4 py-2 text-black bg-gray-400 font-semibold rounded-lg text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 hover:bg-gray-500"
                    >
                        <ArrowLeft size={16} /> Batal
                    </Link>

                    <button 
                        onClick={handleComplete}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-50 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                    >
                        Completed <CheckCircle size={16} />
                    </button>
                </div>
            </div>

            {showSuccessModal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] p-8 md:p-10 max-w-md w-full shadow-2xl text-center relative animate-in zoom-in duration-300">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#0F828C]"></div>

                        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full">
                            <CheckCircle2 size={48} strokeWidth={2.5} />
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                            Materi Selesai!
                        </h2>
                        <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                            Selamat! Kamu telah berhasil mempelajari materi <span className="text-slate-800 font-bold">{course.title}</span>.
                        </p>

                        <div className="space-y-3 flex flex-col items-center"> 
                            {course.link_drive && (
                                <a
                                    href={course.link_drive}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 bg-emerald-600 text-white px-9 py-3 rounded-[10px] font-black text-[11px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 group w-fit" 
                                >
                                    <Download size={16} className="group-hover:animate-bounce" />
                                    <span>Unduh Materi (PDF)</span>
                                </a>
                            )}
                            
                            <button
                                onClick={() => router.visit('/siswa/courseSiswa')}
                                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-[10px] font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 w-fit"
                            >
                                <ArrowLeft size={16} />
                                <span>Kembali ke Daftar Materi</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AppLayout>
    );
}