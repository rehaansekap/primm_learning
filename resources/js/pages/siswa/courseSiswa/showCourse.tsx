import React, { useState } from "react";
import { Head, Link, router } from '@inertiajs/react'; 
import { BookOpen, ArrowRight, ArrowLeft, CheckCircle, Download, CheckCircle2 } from "lucide-react"; 
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
            ? `<iframe width="100%" height="450" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen className="rounded-[30px]"></iframe>` 
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
        <AppLayout breadcrumbs={[{ title: course.title, href: '#' }]}>
            <Head title={course.title} />
            
            <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans text-gray-800">
                <div className="max-w-3xl mx-auto space-y-6">
                    
                    <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100">
                        <h1 className="text-3xl text-blue-600 font-bold uppercase tracking-tighter">{course.title}</h1>
                        <p className="text-gray-400 text-sm mt-2">{course.category?.name || 'Materi Umum'}</p>
                    </div>

                    <div className="bg-blue-100 p-8 rounded-[40px] shadow-sm border border-gray-100">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4 flex items-center gap-2">
                            <BookOpen size={14} /> Inti Materi
                        </h3>
                        <div 
                            className="prose prose-slate max-w-none text-black leading-relaxed font-medium"
                            dangerouslySetInnerHTML={{ __html: course.description }}
                        />
                    </div>

                    <div className="bg-white p-4 rounded-[45px] shadow-sm border border-gray-100 overflow-hidden">
                        {course.link ? (
                            <div 
                                className="w-full aspect-video rounded-[35px] overflow-hidden bg-black shadow-inner"
                                dangerouslySetInnerHTML={{ __html: convertYoutubeToEmbed(course.link) }} 
                            />
                        ) : course.file ? (
                            <div className="w-full min-h-[500px] rounded-[35px] overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
                                {course.file.endsWith('.pdf') ? (
                                    <iframe src={`/storage/${course.file}`} className="w-full h-[600px]" />
                                ) : (
                                    <img src={`/storage/${course.file}`} className="max-w-full h-auto p-4" alt="Materi" />
                                )}
                            </div>
                        ) : (
                            <div className="p-20 text-center text-gray-400 uppercase font-bold text-xs tracking-widest">
                                Tidak ada media untuk materi ini
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-end py-6 gap-4 border-t border-gray-100">
                        <Link 
                            href="/siswa/courseSiswa" 
                            className="w-full md:w-auto px-6 py-3 text-black bg-gray-400 font-semibold rounded-xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} /> Batal
                        </Link>

                        
                        <button 
                            onClick={handleComplete}
                            className="w-full md:w-auto bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-[12px] uppercase tracking-widest shadow-lg shadow-emerald-50 hover:bg-emerald-700 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            Completed <CheckCircle size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {showSuccessModal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] p-8 md:p-10 max-w-md w-full shadow-2xl text-center relative animate-in zoom-in duration-300">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#0F828C] from-blue-500 to-emerald-500"></div>

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