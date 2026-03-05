import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { 
    BookOpen, 
    ClipboardCheck, 
    ArrowRight, 
    Pencil,
    X, 
    Info, 
    Clock, 
    AlertCircle 
} from 'lucide-react';

interface Test {
    id: number;
    title: string;
    description: string;
    link: string;
}

export default function ListTest() {
    const { tests } = usePage<{ tests: Test[] }>().props;
    
    const [selectedTest, setSelectedTest] = useState<Test | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = (test: Test) => {
        setSelectedTest(test);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTest(null);
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50/50 py-10 px-6 lg:px-12">
            
                <div className="max-w-6xl mx-auto mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        List Test yang tersedia
                    </h1>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tests.length > 0 ? (
                        tests.map((test) => (
                            <div 
                                key={test.id} 
                                className="group relative border-[#f4c892] border-2 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-12 h-12 bg-[#78B9B5] rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors duration-300">
                                        <ClipboardCheck className="w-6 h-6 text-white group-hover:text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#78B9B5] transition-colors">
                                        {test.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                                        {test.description || "Tidak ada deskripsi tambahan untuk test ini."}
                                    </p>
                                </div>

                                <button 
                                    onClick={() => handleOpenModal(test)}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#78B9B5] text-white rounded-xl font-bold hover:bg-blue-600 transition-all active:scale-95"
                                >
                                <Pencil className="w-4 h-4" />
                                    Kerjakan
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-3xl">
                            <Info className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">Belum ada test tersedia untuk saat ini.</p>
                        </div>
                    )}
                </div>

                {showModal && selectedTest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div 
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity"
                            onClick={handleCloseModal}
                        ></div>

                        <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <BookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold">Petunjuk Test</h2>
                                </div>
                                <button onClick={handleCloseModal} className="hover:rotate-90 transition-transform duration-300">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-8">
                                <div className="mb-6">
                                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Judul Test</span>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">{selectedTest.title}</h3>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                                        <p className="text-sm text-amber-800 leading-relaxed">
                                            <strong>Penting:</strong> Pastikan koneksi internet Anda stabil. Test akan dibuka di tab baru. Jangan menutup halaman utama sebelum selesai.
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold mb-1">
                                                <Clock className="w-3 h-3" /> Soal
                                            </div>
                                            <div className="text-gray-900 font-bold">30 Soal</div>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold mb-1">
                                                <Info className="w-3 h-3" /> TIPE
                                            </div>
                                            <div className="text-gray-900 font-bold">Pilihan Ganda</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        onClick={handleCloseModal}
                                        className="flex-1 py-4 px-6 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <a 
                                        href={selectedTest.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={handleCloseModal}
                                        className="flex-[2] py-4 px-6 bg-blue-600 text-white text-center font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95"
                                    >
                                        Mulai
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}