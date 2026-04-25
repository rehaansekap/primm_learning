export const useVoice = () => {

    const cleanHtml = (html: string) => {
    if (typeof document === 'undefined') return "";
    
    // 1. Buat element sementara untuk membersihkan tag HTML
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Tambahkan spasi di setiap akhir tag agar teks tidak dempet saat digabung
    doc.querySelectorAll('*').forEach(el => {
        if (el.tagName === 'BR' || el.tagName === 'P' || el.tagName === 'LI') {
            el.after(" "); 
        }
    });

    let text = doc.body.textContent || "";

    // 2. PROSES PEMBERSIHAN AGRESIF
    return text
        // a. Hapus angka otomatis (1. 2. 3.) di awal setiap baris (PENTING!)
        .replace(/^\s*\d+[\s.)-]+\s*/gm, "")
        
        // b. Cari huruf tunggal yang berdiri sendiri (seperti n, a, m, a di baris baru)
        // Kita ubah menjadi "n. a. m. a. " agar TTS mengejanya dan tidak berhenti
        .replace(/\b([a-zA-Z])\b/g, "$1. ")
        
        // c. Bersihkan spasi berlebih agar suara tetap lancar
        .replace(/\s+/g, ' ')
        .trim();
};

    const speak = (message: string) => {
        if (typeof window === 'undefined') return;

        const synth = window.speechSynthesis;
        synth.cancel();

        const processedText = cleanHtml(message);
        if (!processedText) return;

        setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(processedText);
        utterance.lang = 'id-ID';
        
        // Sedikit lambat agar ejaan n, a, m, a jelas
        utterance.rate = 1.0; 

        // Event listener untuk memantau jika suara berhenti mendadak
        utterance.onerror = (event) => {
            console.error("TTS Error:", event.error);
        };

        synth.speak(utterance);
    }, 50) ;
    };

    const pause = () => {
        window.speechSynthesis.pause();
    };

    const resume = () => {
        window.speechSynthesis.resume();
    };

    const stop = () => {
        window.speechSynthesis.cancel();
    };

    return { speak, pause, resume, stop };
};