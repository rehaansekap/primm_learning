import React, { useState, useEffect } from "react";
import { Head, router } from '@inertiajs/react';
import { 
    ArrowRight,ArrowLeft, CheckCircle2, Code2, BookOpen, ExternalLink, Lightbulb, Search
} from "lucide-react";
import AppLayout from '@/layouts/app-layout';

interface Question { id: number; 
    pertanyaan: string; 
    pembahasan: string; 
}

interface PrimmActivity { id: number; tahap: string; gambar: string | null; link_colab: string | null; questions: Question[]; }
interface PrimmData { [key: string]: PrimmActivity[] | undefined; }
interface Course { id: number; title: string; description: string; link?: string; file?: string; }
interface Props { 
    course: Course; 
    primm: PrimmData; 
    activeStepFromUrl?: string; 
    existingAnswers?: {[key: number]: string};
    isAllFinished: boolean;
}

export default function ShowPrimm({ course, primm, activeStepFromUrl, existingAnswers, isAllFinished }: Props) {
    const steps = ["predict", "run", "investigate", "modify", "make"];
    const initialStepIndex = activeStepFromUrl ? steps.indexOf(activeStepFromUrl.toLowerCase()) : 0;
    const [currentStep, setCurrentStep] = useState<number>(initialStepIndex !== -1 ? initialStepIndex : 0);
    const [answers, setAnswers] = useState<{[key: number]: string}>({});
    const activeStep = steps[currentStep];
    const [subView, setSubView] = useState<'menu' | 'materi' | 'aktivitas'>('aktivitas');
    const [openExplatantions, setOpenExplanations] = useState<number[]>([]);

    const toggleExplanation = (id: number) => {
        setOpenExplanations(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    useEffect(() => { 
    setSubView('aktivitas'); 
    }, [activeStep]);

    useEffect(() => {
        if (activeStepFromUrl) {
            const idx = steps.indexOf(activeStepFromUrl.toLowerCase());
            if (idx !== -1) setCurrentStep(idx);
        }
    }, [activeStepFromUrl]);

    useEffect(() => {
        if (existingAnswers) {
            setAnswers(existingAnswers);
        }
    }, [activeStep, existingAnswers]);

    useEffect(() => {
        if (existingAnswers) {
            const savedIds = Object.keys(existingAnswers).map(Number);
            
            if (savedIds.length > 0) {
                setOpenExplanations(prev => {
                    const newIds = savedIds.filter(id => !prev.includes(id));
                    return [...prev, ...newIds];
                });
            }
        }
    }, [existingAnswers]); 

    const renderEmbedMedia = (url: string): string => {
        if (!url) return '';
        if (url.includes('<iframe')) return url.replace('<iframe', '<iframe class="w-full aspect-video rounded-[30px] shadow-lg border-0"');
        let videoId = '';
        if (url.includes('v=')) videoId = url.split('v=')[1]?.split('&')[0];
        else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
        if (videoId) return `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen class="rounded-[30px] shadow-lg w-full aspect-video border-0"></iframe>`;
        return `<div class="p-10 bg-gray-50 rounded-[30px] text-center border-2 border-dashed border-gray-200"><p class="text-xs font-bold text-gray-400 uppercase mb-2">Media Eksternal</p><a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline font-bold flex items-center justify-center gap-2">Buka Media di Tab Baru <ExternalLink size={14} /></a></div>`;
    };

    const parseQuestionText = (text: string) => {
        try {
            if (typeof text === 'string' && text.trim().startsWith('{')) {
                const parsed = JSON.parse(text);
                return parsed.teks || text;
            }
            return text;
        } catch (e) { return text; }
    };

    const handleAnswerChange = (questionId: number, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const activities = primm[activeStep] || [];

    const handleFinalComplete = () => {
        if (isAllFinished) {
            router.visit('/siswa/courseSiswa'); 
            return;
        }

        router.post(`/siswa/courseSiswa/complete/${course.id}`, {}, {
            onSuccess: () => {
                alert("Selamat! Seluruh tahapan PRIMM berhasil diselesaikan.");
                router.visit('/siswa/courseSiswa'); 
            },
            onError: (errors) => {
                alert(errors.message || "Ada tahap yang belum lengkap.");
            }
        });
    };

    const handleSaveAndNext = () => {
        if (isAllFinished) {
            if (currentStep < steps.length - 1) {
                const nextStepIndex = currentStep + 1;
                router.visit(`/siswa/courseSiswa/showPrimm/${course.id}/${steps[nextStepIndex]}`);
            } else {
                router.visit('/siswa/courseSiswa');
            }
            return; 
        }

        const currentQuestions = activities.flatMap(act => act.questions.map(q => q.id));
        const isAllAnswered = currentQuestions.every(id => answers[id] && answers[id].trim() !== "");

        if (!isAllAnswered) {
            alert("Ups! Kamu harus mengisi semua jawaban di tahap ini sebelum lanjut.");
            return;
        }

        const isAlreadySaved = currentQuestions.every(id => !!existingAnswers?.[id]);

        if (isAlreadySaved) {
            if (currentStep < steps.length - 1) {
                const nextStepIndex = currentStep + 1;
                router.visit(`/siswa/courseSiswa/showPrimm/${course.id}/${steps[nextStepIndex]}`);
            } else {
                handleFinalComplete();
            }
        } else {
            router.post('/siswa/courseSiswa/saveProgress', {
                course_id: course.id,
                tahap: activeStep,
                jawaban: answers 
            }, {
                preserveScroll: true, 
                onSuccess: () => {
                    alert("Jawaban tersimpan! Silakan cek pembahasan yang muncul.");
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: course.title, href: '#' }]}>
            <Head title={`Belajar PRIMM - ${course.title}`} />
            <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans text-gray-800">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 mb-8">
                        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                            Tahap <span className="text-blue-600">{activeStep}</span>
                        </h1>
                        <p className="text-[12px] font-bold text-black uppercase tracking-[0.3em] mt-2">
                            Materi: <span className="text-blue-600">{course.title}</span>
                        </p>
                    </div>

                    <div className="space-y-12" key={activeStep}>
                        {(['investigate', 'modify', 'make'].includes(activeStep)) && subView === 'materi' ? (
                            <div className=" bg-white p-10 rounded-[35px] shadow-sm border border-gray-100 animate-in fade-in duration-500">
                                <div className="bg-blue-100 p-8 rounded-[35px] shadow-sm border border-gray-100">
                                        <h3 className="text-[11px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2"><BookOpen size={14} /> Inti Materi</h3>
                                        <div className="text-gray-600 leading-relaxed font-medium prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: course.description }} />
                                </div>
                                <div className="prose prose-slate">
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2 mt-4 pt-4 mb-4"> Silahkan pahami materi dibawah ini!</h3>
                                    {course.link && <div className="max-w-2xl mx-auto mb-8 overflow-hidden rounded-[30px] justify-center" dangerouslySetInnerHTML={{ __html: renderEmbedMedia(course.link) }} />}
                                    {course.file && (
                                        <div className="mb-8 rounded-[35px] overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                                            {course.file.endsWith('.pdf') ? <iframe src={`/storage/${course.file}`} className="w-full h-[500px] border-0" /> : <img src={`/storage/${course.file}`} className="w-full h-auto object-contain mx-auto" alt="Materi" />}
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-end border-t border-gray-100 pt-10">
                                        <button onClick={() => setSubView('aktivitas')} className="flex items-center justify-center gap-3 bg-gray-500 text-white px-6 py-3 rounded-2xl font-bold text-[12px] uppercase tracking-wider shadow-lg hover:text-black hover:bg-gray-200 transition-all group">
                                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> <span>Kembali ke Aktivitas</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-12 animate-in fade-in duration-700">
                                {['investigate', 'modify', 'make'].includes(activeStep) && (
                                    <div className="flex mb-6">
                                        <button 
                                            onClick={() => setSubView('materi')}
                                            className="flex items-center justify-center gap-3 bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-wider shadow-sm hover:bg-blue-50 transition-all"
                                        >
                                            <BookOpen size={16} /> <span>Pelajari Materi</span>
                                        </button>
                                    </div>
                                )}

                                {activities.map((act, idx) => (
                                    <div key={act.id} className="space-y-10 animate-in fade-in duration-700">
                                        {act.gambar && (
                                            <div className="bg-white p-4 rounded-[15px] border border-gray-100 shadow-sm text-center">
                                                <img 
                                                    src={`/storage/${act.gambar}`} 
                                                    className="max-w-xs w-full h-auto rounded-[15px] max-h-[170px] mx-auto object-contain" 
                                                    alt="Code" 
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-8">
                                            {act.questions && act.questions.map((q, qIdx) => (
                                                <div key={q.id} className="bg-white rounded-[30px] border border-gray-300 shadow-sm overflow-hidden">
                                                    
                                                    <div className="bg-gray-100 p-6 flex items-center gap-5 border-b border-gray-100">
                                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black flex-shrink-0 shadow-md shadow-blue-200">
                                                            {idx + 1}{String.fromCharCode(97 + qIdx)}
                                                        </div>
                                                        <p className="text-[15px] text-justify font-bold text-gray-800 leading-relaxed whitespace-pre-line">
                                                            {parseQuestionText(q.pertanyaan)}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="p-8 space-y-6">
                                                        <div className="relative">
                                                            {activeStep === 'modify' || activeStep === 'make' ? (
                                                                <div className="space-y-6">
                                                                    
                                                                    <div className="bg-[#FFFBEB] border-l-4 border-[#F59E0B] p-6 rounded-r-[20px] shadow-sm animate-in fade-in duration-500">
                                                                        <div className="flex items-center gap-3 mb-4">
                                                                            <span className="text-xl">⚠️</span>
                                                                            <h4 className="text-[14px] font-black text-[#92400E] uppercase tracking-tight">
                                                                                PENTING: Baca Petunjuk Sebelum Mengerjakan
                                                                            </h4>
                                                                        </div>

                                                                        <p className="text-[12px] text-[#B45309] font-medium mb-4 leading-relaxed">
                                                                            Langkah ini WAJIB dilakukan sebelum memodifikasi dan mengumpulkan link. Tanpa ini, guru tidak bisa mengakses pekerjaan Anda.
                                                                        </p>
                                                                        
                                                                        <div className="space-y-4">
                                                                            <div className="bg-white border border-[#FEF3C7] rounded-[15px] p-5 shadow-inner">
                                                                                <div className="flex items-center gap-2 mb-3">
                                                                                    <Code2 size={16} className="text-[#F59E0B]" />
                                                                                    <p className="text-[13px] font-black text-[#B45309] uppercase tracking-widest">Langkah Modifikasi Program:</p>
                                                                                </div>
                                                                                <ol className="text-[13px] text-[#92400E]/90 space-y-2 ml-4 list-decimal font-medium">
                                                                                    <li>Klik tombol <strong className="text-blue-600">"Buka Modifikasi (pada tahap modify) dan Buat program (jika ditahap make)"</strong> yang berada di sebelah kiri button simpan.</li>
                                                                                    <li>Setelah Google Colab terbuka, pilih menu <strong>"File"</strong> kemudian klik <strong>"Save a copy in Drive"</strong>.</li>
                                                                                    <li><span className="text-red-600 font-bold underline">JANGAN</span> mengedit sebelum melakukan copy!</li>
                                                                                    <li>Buka salinan file tersebut di <strong>tab baru</strong> untuk mulai mengerjakan.</li>
                                                                                </ol>
                                                                            </div>

                                                                            <div className="bg-blue-50/50 border border-blue-100 rounded-[15px] p-5 shadow-inner">
                                                                                <div className="flex items-center gap-2 mb-3">
                                                                                    <Lightbulb size={16} className="text-blue-600" />
                                                                                    <p className="text-[13px] font-black text-blue-700 uppercase tracking-widest">Langkah Pengumpulan Link:</p>
                                                                                </div>
                                                                                <ol className="text-[14px] text-blue-800 space-y-2 ml-4 list-decimal font-medium">
                                                                                    <li>Ubah judul menjadi <strong>"nama kelompok_modify_judul materi"</strong></li>
                                                                                    <li>Jika sudah selesai mengedit, klik tombol <strong className="text-blue-700">"Share"</strong> di pojok kanan atas Google Colab.</li>
                                                                                    <li>Ubah akses dari "Restricted" menjadi <strong>"Anyone with the link"</strong>.</li>
                                                                                    <li>Klik <strong>"Copy Link"</strong> dan tempelkan ke kotak link di bawah ini.</li>
                                                                                    <li>Lalu, <strong>"Simpan"</strong></li>
                                                                                </ol>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="bg-[#F0FDF4] border-2 border-[#BBF7D0] p-6 rounded-[25px] shadow-sm">
                                                                        <div className="flex items-center gap-2 mb-3 text-[#166534]">
                                                                            <ExternalLink size={18} />
                                                                            <span className="text-[12px] font-bold uppercase tracking-wider">Link Google Colab Anda:</span>
                                                                        </div>
                                                                        <input 
                                                                            type="url" 
                                                                            value={answers[q.id] || ''} 
                                                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)} 
                                                                            readOnly={!!existingAnswers?.[q.id]} 
                                                                            className={`w-full px-5 py-4 rounded-[15px] text-sm transition-all outline-none font-medium border-2 
                                                                                ${!!existingAnswers?.[q.id] 
                                                                                    ? 'bg-white/50 border-emerald-200 text-emerald-800 cursor-not-allowed' 
                                                                                    : 'bg-white border-emerald-100 focus:border-emerald-500 text-emerald-900 shadow-inner'}`} 
                                                                            placeholder="https://colab.research.google.com/drive/..." 
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="relative">
                                                                    <div className={`w-full p-6 rounded-[25px] text-[14px] transition-all border-2 flex items-start 
                                                                        ${!!existingAnswers?.[q.id] 
                                                                            ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]' 
                                                                            : 'bg-[#F8FAFC] border-gray-100'}`}>
                                                                        
                                                                        {!!existingAnswers?.[q.id] && (
                                                                            <CheckCircle2 size={18} className="text-[#10B981] mr-3 mt-0.5 flex-shrink-0" strokeWidth={3} />
                                                                        )}

                                                                        <textarea 
                                                                            value={answers[q.id] || ''} 
                                                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)} 
                                                                            readOnly={!!existingAnswers?.[q.id]} 
                                                                            className={`w-full p-4 rounded-xl transition-all duration-300 
                                                                                ${!!existingAnswers?.[q.id] 
                                                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 cursor-not-allowed shadow-inner' 
                                                                                    : 'bg-white border-gray-200 focus:border-blue-500 shadow-sm'
                                                                                }`}
                                                                            placeholder="Tuliskan jawabanmu di sini..." 
                                                                        />

                                                                        {!!existingAnswers?.[q.id] && (
                                                                            <div className="absolute bottom-3 right-3">
                                                                                <span className="text-[9px] bg-[#10B981] text-white font-black uppercase px-2.5 py-1 rounded-md shadow-sm">
                                                                                    TERSIMPAN
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        

                                                        {!!existingAnswers?.[q.id] && (
                                                            <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-500">
                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => toggleExplanation(q.id)}
                                                                    className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
                                                                >
                                                                    {openExplatantions.includes(q.id) ? (
                                                                        <> <ArrowLeft size={14} className="rotate-90" /> TUTUP PEMBAHASAN </>
                                                                    ) : (
                                                                        <> <ArrowRight size={14} /> LIHAT PEMBAHASAN </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        )}

                                                        {openExplatantions.includes(q.id) && (
                                                            <div className="p-6 bg-[#EFF6FF] border border-blue-500 rounded-[20px] animate-in slide-in-from-top-2 duration-300">
                                                                <div className="flex items-start gap-4">
                                                                    <div className="p-2.5 bg-white rounded-xl shadow-sm flex-shrink-0">
                                                                        <Lightbulb size={18} className="text-blue-500" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-[14px] font-black uppercase tracking-widest text-blue-500 mb-1">Penjelasan</p>
                                                                        <div className="text-[14px] text-black leading-relaxed font-medium">
                                                                            {q.pembahasan && q.pembahasan.trim() !== "" ? q.pembahasan : "Maaf, guru belum memberikan pembahasan."}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {subView === 'aktivitas' && (
                        <div className="flex flex-col md:flex-row justify-end items-center mt-12 mb-24 gap-4 w-full border-t border-gray-100 pt-10"> 
                            <div className="flex flex-col md:flex-row items-center md:items-center justify-end gap-4 w-full md:w-auto">
                                {(activeStep === 'modify' || activeStep === 'make') && activities.length > 0 && (
                                    <div className="flex flex-col justify-end items-center md:items-end gap-2 w-full md:w-auto">
                                        {!existingAnswers?.[activities[0].questions[0]?.id] && (
                                            <a
                                                href={activities[0].link_colab || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center gap-2 bg-[#14B8A6] text-white px-6 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#0D9488] transition-all shadow-lg active:scale-95 w-full md:w-auto"
                                            >
                                                <Code2 size={16} />
                                                <span>{activeStep === 'modify' ? 'Buka Modifikasi' : 'Buat Program'}</span>
                                            </a>
                                        )}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleSaveAndNext}
                                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 w-full md:w-auto"
                                >
                                    <span>
                                        {isAllFinished 
                                            ? (currentStep === steps.length - 1 ? 'Selesai & Kembali' : 'Lihat Berikutnya') 
                                            : (() => {
                                                const currentQuestions = activities.flatMap(act => act.questions.map(q => q.id));
                                                const isSaved = currentQuestions.length > 0 && currentQuestions.every(id => !!existingAnswers?.[id]);
                                                
                                                if (isSaved) {
                                                    return currentStep === steps.length - 1 ? 'Selesaikan Semua' : 'Lanjut ke Tahap Berikutnya';
                                                }
                                                return 'Simpan & Lihat Pembahasan';
                                            })()
                                        }
                                    </span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}