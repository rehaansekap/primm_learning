import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function DaftarMateriSiswa({ student, materials }: any) {
    return (
        <AppLayout>
            <Head title={`Materi - ${student.name}`} />
            <div className="p-8 bg-slate-50 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6 text-slate-800 uppercase tracking-tight">
                        Materi yang Dikerjakan: <span className="text-blue-600">{student.name}</span>
                    </h1>
                    
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-center border-collapse ">
                            <thead className="bg-slate-200 border-b border-slate-300 text-center">
                                <tr>
                                    <th className="p-4 text-[13px] font-bold text-slate-500 uppercase ">Judul Materi</th>
                                    <th className="p-4 text-[13px] font-bold text-slate-500 uppercase ">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {materials.map((materi: any) => (
                                    <tr key={materi.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="p-4">
                                            <span className="text-sm font-bold text-slate-700">
                                                {materi.title} 
                                            </span>
                                        </td>
                                        
                                        <td className="p-4 text-center">
                                            <Link 
                                                href={`/guru/nilai/detail/${student.id}/${materi.id}`}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-all"
                                            >
                                                Buka & Beri Nilai
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}