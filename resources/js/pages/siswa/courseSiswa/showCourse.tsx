import React from "react";
import { Head, Link, router } from '@inertiajs/react'; 
import { BookOpen, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"; 
import AppLayout from '@/layouts/app-layout';

export default function ShowCourse({ course }: { course: any }) {
    
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
            onFinish: () => {
                router.visit('/siswa/courseSiswa/listCourse');
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

                    <div className="flex flex-row items-center justify-end py-6 gap-4 border-t border-gray-100">
                        <Link 
                            href="/siswa/courseSiswa" 
                            className="px-6 py-3 text-black bg-gray-400 font-semibold rounded-xl text-xs uppercase tracking-widest  transition-colors flex items-center gap-2"
                        >
                           <ArrowLeft size={18} /> Batal
                        </Link>
                        
                        <button 
                            onClick={handleComplete}
                            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-[12px] uppercase tracking-widest shadow-lg shadow-emerald-50 hover:bg-emerald-700 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            Completed <CheckCircle size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}