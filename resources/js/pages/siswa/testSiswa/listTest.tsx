import React, { useState} from 'react';
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
                    {tests.map((test) => (
                        <div 
                            key={test.id} 
                            className="relative bg-white border border-[#78B9B5] rounded-[15px] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                        >

                            <div>
                                <div className="w-12 h-12 bg-[#E6F4F1] rounded-xl flex items-center justify-center mb-4">
                                    <ClipboardCheck className="w-6 h-6 text-[#78B9B5]" />
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {test.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-snug line-clamp-2">
                                        {test.description || "Test awal untuk mengukur pengetahuan awal peserta sebelum memulai pembelajaran."}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 mb-5 text-gray-500 text-xs font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>30 menit</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="h-[1.5px] w-3 bg-gray-400"></div>
                                            <div className="h-[1.5px] w-3 bg-gray-400"></div>
                                            <div className="h-[1.5px] w-3 bg-gray-400"></div>
                                        </div>
                                        <span>20 soal</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <button 
                                    onClick={() => handleOpenModal(test)}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold hover:border-[#78B9B5] hover:text-[#78B9B5] transition-all active:scale-[0.98] text-sm"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                    Mulai Kerjakan
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {showModal && selectedTest && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay dengan blur yang lebih halus */}
        <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={handleCloseModal}
        ></div>

        <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-[#3BB0A7] p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                        <ClipboardCheck className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-m font-bold tracking-tight">Petunjuk Test</h2>
                </div>
                <button 
                    onClick={handleCloseModal} 
                    className="w-10 h-10 border border-white/30 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                    <X className="w-6 h-6 text-white" />
                </button>
            </div>

            <div className="p-8">
                <div className="mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3BB0A7]">Judul Test</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">{selectedTest.title}</h3>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4 p-5 bg-[#FFF9ED] rounded-2xl border-l-4 border-[#D99E1B]">
                        <AlertCircle className="w-5 h-5 text-[#D99E1B] shrink-0 mt-0.5" />
                        <p className="text-sm text-[#856404] font-semibold leading-relaxed">
                            Penting: <span className="font-normal">Pastikan koneksi internet Anda stabil. Test akan dibuka di tab baru. Jangan menutup halaman utama sebelum selesai.</span>
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-[#F9F9F7] rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 text-[#3BB0A7] text-[10px] font-black tracking-widest mb-2 uppercase">
                                <Clock className="w-4 h-4" /> Soal
                            </div>
                            {/* Ukuran Soal diubah dari 4xl ke xl agar lebih proporsional */}
                            <div className="text-base font-bold text-gray-800">30 Soal</div>
                        </div>
                        <div className="p-5 bg-[#F9F9F7] rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 text-[#3BB0A7] text-[10px] font-black tracking-widest mb-2 uppercase">
                                <Info className="w-4 h-4" /> Tipe
                            </div>
                            {/* Ukuran Tipe disesuaikan ke base/sm agar terlihat bersih */}
                            <div className="text-base font-bold text-gray-800 leading-tight">Pilihan Ganda</div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-4 mt-10">
                    <button 
                        onClick={handleCloseModal}
                        className="flex-1 py-2 px-2 border border-gray-400 text-gray-900 font-bold rounded-2xl hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                    <a 
                        href={selectedTest.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleCloseModal}
                        className="flex-[2] py-2 px-2 bg-white border border-[#78B9B5] text-gray-900 text-center font-bold rounded-2xl hover:border-[#3BB0A7] hover:text-[#3BB0A7] transition-all flex items-center justify-center gap-3 active:scale-95 group"
                    >
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#3BB0A7]">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                        Mulai Test
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