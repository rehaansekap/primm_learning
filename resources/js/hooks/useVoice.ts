export const useVoice = () => {

    const angkaKeTeks = (n: number): string => {
        if (n === 0) return "nol";
        const unit = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
        if (n < 12) return unit[n];
        if (n < 20) return angkaKeTeks(n - 10) + " belas";
        if (n < 100) return angkaKeTeks(Math.floor(n / 10)) + " puluh " + (n % 10 !== 0 ? " " + angkaKeTeks(n % 10) : "");
        if (n < 200) return "seratus " + (n - 100 !== 0 ? angkaKeTeks(n - 100) : "");
        if (n < 1000) return angkaKeTeks(Math.floor(n / 100)) + " ratus " + (n % 100 !== 0 ? " " + angkaKeTeks(n % 100) : "");
        return n.toString(); 
    };

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

        const textToSpeak = processedText.replace(/\d+/g, (match) => {
            return angkaKeTeks(parseInt(match));
        });

        setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
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