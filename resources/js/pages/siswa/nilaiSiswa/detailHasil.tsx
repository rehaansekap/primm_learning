import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, MessageCircle, CheckCircle2, Trophy, Info } from "lucide-react";

export default function DetailHasil({ reports, course_title }: any) {
    return (
        <AppLayout>
            <Head title={`Detail - ${course_title}`} />
            
            <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 flex items-center gap-4">
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                            {course_title}
                        </h1>
                    </div>

                    <div className="space-y-12">
                        {reports.map((item: any, index: number) => (
                            <div key={index} className="bg-white border border-slate-200 rounded-[35px] shadow-sm overflow-hidden transition-all">

                                <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                                    <div className="flex items-center gap-3">
                                        <span className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-blue-100">
                                            {index + 1}
                                        </span>
                                        <h2 className="font-black uppercase text-slate-800 tracking-tight">
                                            Tahap <span className="text-blue-600">{item.question?.primm?.tahap}</span>
                                        </h2>
                                    </div>
                                    <div className="flex flex-col items-center justify-center border-2 border-[#f4c892] px-5 py-2 rounded-2xl bg-white shadow-sm">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Skor</span>
                                        <span className="text-2xl font-black text-slate-900">{item.skor ?? '0'}</span>
                                    </div>
                                </div>

                                <div className="p-8 space-y-8">
                                    {item.question?.primm?.gambar && (
                                        <div className="bg-white p-6 rounded-[25px] border border-slate-100 shadow-sm flex justify-center mb-6">
                                            <img 
                                                src={`/storage/${item.question.primm.gambar}`} 
                                                className="max-w-xs w-full h-auto rounded-[15px] max-h-[180px] object-contain" 
                                                alt="Visual Kode" 
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Info size={14} className="text-blue-500" />
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pertanyaan:</h4>
                                        </div>
                                        <p className="text-slate-800 font-bold text-justify leading-relaxed text-[15px] pl-1 whitespace-pre-line">
                                            {item.question?.pertanyaan}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Jawaban Kamu:</h4>
                                        <div className="w-full p-6 rounded-[25px] text-[14px] transition-all border-2 flex items-start bg-[#F0FDF4] border-[#BBF7D0] text-[#166534] shadow-sm">
                                            
                                            <div className="flex-1">
                                                <pre className="bg-transparent w-full outline-none font-medium leading-relaxed whitespace-pre-wrap font-sans ">
                                                    {item.jawaban_siswa || 'Tidak ada jawaban yang dikirimkan.'}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`rounded-[25px] p-6 border ${item.feedback ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-2xl shadow-sm ${item.feedback ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-500'}`}>
                                                <MessageCircle size={20} />
                                            </div>
                                            <div>
                                                <h4 className={`text-[10px] font-black uppercase tracking-widest mb-1 ${item.feedback ? 'text-blue-600' : 'text-slate-500'}`}>
                                                    Feedback Guru
                                                </h4>
                                                <p className={`text-sm leading-relaxed ${item.feedback ? 'text-slate-900 font-bold' : 'italic text-slate-400'}`}>
                                                    {item.feedback ? `"${item.feedback}"` : "Belum ada feedback untuk jawaban ini."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="pt-4 flex justify-between">
                            <Link 
                                href="/siswa/nilaiSiswa" 
                                className="inline-flex items-center gap-3 px-8 py-3 bg-slate-600 border border-slate-200 text-white rounded-2xl hover:bg-slate-800 hover:text-white transition-all active:scale-95 group font-black uppercase text-xs tracking-widest"
                            >
                                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                Kembali ke Daftar Nilai
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}