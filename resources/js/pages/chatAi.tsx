import React, { FormEvent, useState, useEffect, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { X, BotMessageSquare, Send } from 'lucide-react';

interface ChatAIProps {
    pertanyaanId: number;
}

const ChatAI: React.FC<ChatAIProps> = ({ pertanyaanId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { props } = usePage<any>(); // Ambil seluruh props untuk reaktivitas lebih baik
    const scrollRef = useRef<HTMLDivElement>(null);
    
    const [messages, setMessages] = useState<{role: string, content: string}[]>([]);

    const { data, setData, post, processing, reset } = useForm({
        question: '',
        pertanyaan_id: pertanyaanId, 
    });

    // 1. Auto-scroll ke pesan terbawah setiap ada pesan baru
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, processing]);

    // 2. Sinkronisasi ID Soal jika prop berubah (saat pindah soal)
    useEffect(() => {
        setData('pertanyaan_id', pertanyaanId);
    }, [pertanyaanId]);

useEffect(() => {
    const responseTerbaru = props.flash?.aiResponse;
        if (responseTerbaru) {
            setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg?.role === 'bot' && lastMsg.content === responseTerbaru) {
                    return prev;
                }
                return [...prev, { role: 'bot', content: responseTerbaru }];
            });

            props.flash.aiResponse = null;
        }
}, [props.flash?.aiResponse]);

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.question.trim() || processing) return;

    // Tampilkan pesan user di chat
    setMessages(prev => [...prev, { role: 'user', content: data.question }]);

    post('/ask-gemini', {
        preserveScroll: true, // Supaya halaman nggak lompat ke atas
        preserveState: true,  // Supaya chat nggak ketutup/reset
        
        // --- INI KUNCINYA ---
        // 'only' akan memerintah server cuma kirim data 'flash'.
        // Data PRIMM, soal, dll TIDAK akan dikirim ulang.
        only: ['flash'], 
        onSuccess: () => {
            reset('question');
        },
    });
};
    return (
        <div className="fixed bottom-14 right-15 z-[100] flex flex-col items-end gap-3 font-sans">
            {isOpen && (
                <div className="w-[350px] md:w-[380px] h-[500px] bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 flex flex-col animate-in slide-in-from-bottom-5 duration-300">
                    
                    {/* Header */}
                    <div className="bg-[#0F828C] p-4 text-white flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <BotMessageSquare size={24} />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold leading-none">Tutor AI PrimmLearn</h2>
                                <span className="text-[10px] text-green-300 flex items-center gap-1 mt-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    Online
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-full transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Body dengan Ref untuk Auto-scroll */}
                    <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-5 bg-gray-50 flex flex-col gap-4 scroll-smooth"
                    >
                        {messages.length > 0 ? (
                            messages.map((msg, index) => (
                                <div key={index} className={`flex flex-col gap-1.5`}>
                                    <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'bot' && <BotMessageSquare size={14} className="text-[#0F828C]" />}
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                            {msg.role === 'bot' ? 'Tutor AI' : 'Kamu'}
                                        </span>
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm max-w-[90%] border ${
                                        msg.role === 'user' 
                                        ? 'self-end bg-[#0F828C] text-white rounded-tr-none border-[#0F828C]' 
                                        : 'self-start bg-white text-gray-800 rounded-tl-none border-gray-100'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 opacity-60">
                                <BotMessageSquare size={32} className="text-gray-300" />
                                <p className="text-xs italic text-center max-w-[200px]">
                                    Halo! 👋 Bingung dengan logika soal ini? Tanyakan saja ke aku ya!
                                </p>
                            </div>
                        )}

                        {processing && (
                            <div className="self-start bg-gray-100 p-3 px-4 rounded-2xl rounded-tl-none text-[11px] text-gray-500 italic flex items-center gap-2 animate-pulse">
                                Tutor sedang berpikir...
                            </div>
                        )}
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100">
                        <div className="flex gap-2 bg-gray-50 p-1.5 rounded-full border border-gray-200 focus-within:border-[#0F828C] transition-all">
                            <input 
                                type="text"
                                value={data.question}
                                onChange={(e) => setData('question', e.target.value)}
                                placeholder="Tanyakan kesulitanmu..."
                                className="flex-1 bg-transparent border-none px-4 py-2 text-sm focus:ring-0 outline-none"
                                disabled={processing}
                            />
                            <button 
                                type="submit"
                                disabled={processing || !data.question.trim()}
                                className="bg-[#0F828C] hover:bg-[#0D6B74] text-white p-2.5 rounded-full transition-all disabled:bg-gray-300 flex items-center justify-center active:scale-90"
                            >
                                <Send size={18} className={processing ? 'animate-pulse' : ''} />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!isOpen && (
                <button onClick={() => setIsOpen(true)} className="w-13 h-13 rounded-full flex items-center justify-center shadow-2xl transition-all bg-[#0F828C] hover:bg-[#0D6B74] relative group">
                    <BotMessageSquare size={28} className="text-white group-hover:scale-110 transition-transform" />
                    <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                </button>
            )}
        </div>
    );
};

export default ChatAI;