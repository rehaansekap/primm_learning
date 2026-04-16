import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BookOpen, BarChart3, Eye, Trophy } from "lucide-react";

export default function HasilBelajar({ results }: any) {
    
    const materiBerpenilaian = results.filter((res: any) => !res.is_pengenalan);

    
    const totalSkorKumulatif = materiBerpenilaian.reduce(
        (acc: number, curr: any) => acc + (parseFloat(curr.total_skor_materi) || 0), 0
    );

    const hasilAkhirKeseluruhan = materiBerpenilaian.length > 0 
        ? Math.round(totalSkorKumulatif / materiBerpenilaian.length)
        : 0;

    return (
        <AppLayout>
            <Head title="Hasil Belajar Siswa" />
            
            <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-700">
                <div className="max-w-6xl mx-auto">
                    
                    <div className="mb-8 flex items-center gap-3">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Hasil Belajar
                    </h1>
                    </div>

                    <div className="bg-white rounded-[25px] shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-100 border-b border-slate-200">
                                <tr>
                                    <th className="px-8 py-4 text-[11px] font-black text-black uppercase tracking-widest flex items-center gap-2">
                                        <BookOpen size={13} /> Materi
                                    </th>
                                    <th className="px-6 py-4 text-[11px] font-black text-black uppercase tracking-widest text-center">
                                        Fase Selesai
                                    </th>
                                    <th className="px-6 py-4 text-[11px] font-black text-black uppercase tracking-widest text-center">
                                        Total Skor
                                    </th>
                                    <th className="px-8 py-4 text-[11px] font-black text-black uppercase tracking-widest text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-50">
                                {results.map((res: any, index: number) => (
                                    <tr key={index} className="group hover:bg-slate-50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center font-black text-xs group-hover:bg-slate-700 group-hover:text-white transition-all">
                                                    {index + 1}
                                                </div>
                                                <div className="font-bold text-slate-800 uppercase text-[12px] tracking-tight">
                                                    {res.title}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-center">
                                            {!res.is_pengenalan ? (
                                                <span className="text-[14px] font-black text-slate-700">
                                                    {res.total_fase} / 5
                                                </span>
                                            ) : (
                                                <span className="text-slate-300">-</span>
                                            )}
                                        </td>

                                        <td className="px-6 py-5 text-center">
                                            {!res.is_pengenalan ? (
                                                <div className="inline-flex bg-[#F0FDF4] px-3 py-1 rounded-md border border-[#BBF7D0] text-[13px] font-black text-[#166534]">
                                                    {Math.round(parseFloat(res.total_skor_materi) || 0)}
                                                </div>
                                            ) : '-'}
                                        </td>

                                        <td className="px-8 py-5 text-center">
                                            {res.id && !res.is_pengenalan ? (
                                                <Link 
                                                    href={`/siswa/nilaiSiswa/detailHasil/${res.id}`}
                                                    className="inline-flex items-center gap-2 bg-[#f4c892] text-black px-5 py-2.5 rounded-xl text-[10px] font-black hover:bg-[#78B9B5] hover:text-white transition-all shadow-md active:scale-95 uppercase tracking-widest"
                                                >
                                                    <Eye size={14} /> Detail Nilai
                                                </Link>
                                            ) : (
                                                <span className="text-[9px] font-bold text-slate-400 uppercase italic">Materi Teori</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="bg-[#EFF6FF] px-8 py-5 flex items-center justify-between border-t border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg text-white">
                                    <BarChart3 size={16} />
                                </div>
                                <div>
                                    <span className="font-black uppercase tracking-widest text-[11px] block text-blue-700">Hasil Akhir Nilai Keseluruhan</span>
                                </div>
                            </div>
                            <div className="bg-white px-4 py-2 rounded-[10px] shadow-sm border border-blue-200">
                                <span className="text-2xl font-black text-blue-600 tracking-tighter">
                                    {hasilAkhirKeseluruhan}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}