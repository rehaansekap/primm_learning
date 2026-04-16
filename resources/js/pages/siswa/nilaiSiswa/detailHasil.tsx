import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, MessageCircle, Code2 } from "lucide-react";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

export default function DetailHasil({ reports, course_title }: any) {
    return (
        <AppLayout>
            <Head title={`Detail - ${course_title}`} />
            
            <div className="p-4 md:p-8 bg-[#FDFBF7] min-h-screen font-sans">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-1 bg-[#10837E] rounded-full"></div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                Laporan Aktivitas PRIMM
                            </span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                            {course_title}
                        </h1>
                    </div>

                    <div className="space-y-10">
                        {reports.map((item: any, index: number) => {
                            const tahap = item.question?.primm?.tahap || "Predict";
                            const soalCode = item.question?.primm?.kode_program;
                            const isCodingStep = ['modify', 'make'].includes(tahap.toLowerCase());
                            const jawabanSiswaKode = item.kode_program; 

                            return (
                                <div key={index} className="bg-white border border-slate-200 rounded-[20px] shadow-sm overflow-hidden">
                                    {/* Top Bar: Tahap & Skor */}
                                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#10837E] text-white flex items-center justify-center font-bold text-lg">
                                                {index + 1}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tahap</span>
                                                <span className="text-[#10837E] font-black text-l tracking-tight uppercase">{tahap}</span>
                                            </div>
                                        </div>
                                        <div className="bg-[#F8F9FA] border border-[#10837E] rounded-xl px-4 py-2 flex flex-col items-center min-w-[70px]">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">SKOR</span>
                                            <span className="text-xl font-black text-slate-800">{item.skor ?? '0'}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                                        
                                        <div className="w-full lg:w-1/2 p-6 bg-[#F8F9FA]">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Code2 size={14} className="text-[#10837E]" />
                                                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">KODE PROGRAM (SOAL)</h4>
                                            </div>
                                            
                                            <div className=" overflow-hidden shadow-md border border-slate-300">
                                                <CodeMirror
                                                    value={soalCode || "# Kode soal tidak tersedia"}
                                                    theme={vscodeDark}
                                                    extensions={[python()]}
                                                    readOnly={true}
                                                    height="400px" 
                                                    style={{ fontSize: '14px' }}
                                                    basicSetup={{ lineNumbers: true, foldGutter: true }}
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full lg:w-1/2 p-6 space-y-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-3 text-slate-500">
                                                    <MessageCircle size={14} />
                                                    <h4 className="text-[11px] font-bold uppercase tracking-wider">PERTANYAAN</h4>
                                                </div>
                                                <div className="bg-[#FDFBF7] border-l-4 border-[#10837E] p-4 rounded-r-xl">
                                                    <p className="text-slate-800 font-semibold leading-relaxed text-sm whitespace-pre-wrap text-justify">
                                                        {item.question?.pertanyaan}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-3 text-slate-500">
                                                    <h4 className="text-[11px] font-bold uppercase tracking-wider">
                                                        {isCodingStep ? 'KODE PROGRAM KAMU' : 'JAWABAN KAMU'}
                                                    </h4>
                                                </div>

                                                {isCodingStep ? (
                                                    <div className="overflow-hidden border border-slate-300 shadow-md">
                                                        <CodeMirror
                                                            value={jawabanSiswaKode || "# Kamu tidak mengirimkan kode."}
                                                            theme={vscodeDark}
                                                            extensions={[python()]}
                                                            readOnly={true}
                                                            height="400px" 
                                                            style={{ fontSize: '14px' }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="bg-[#E9F7F3] border border-[#BEE3D8] p-4 rounded-xl min-h-[100px]">
                                                        <p className="text-[#10837E] font-medium text-sm">
                                                            {item.jawaban_siswa || 'Tidak ada jawaban.'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-slate-100">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                                                        <MessageCircle size={16} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[10px] font-bold text-[#10837E] uppercase mb-1">Feedback Guru</h4>
                                                        <p className="text-sm text-slate-500 italic leading-snug">
                                                            {item.feedback ? `"${item.feedback}"` : "Belum ada catatan dari guru."}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-10 pb-10">
                        <Link 
                            href="/siswa/nilaiSiswa" 
                            className="inline-flex items-center gap-2 px-4 py-3 bg-slate-600 text-white rounded-xl hover:bg-black transition-all font-bold text-sm shadow-lg group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            KEMBALI KE DAFTAR NILAI
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}