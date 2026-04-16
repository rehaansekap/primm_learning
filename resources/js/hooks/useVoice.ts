export const useVoice = () => {
    const speak = (message: string) => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel(); // Hentikan suara sebelumnya (tumpang tindih)
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'id-ID';
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    };

    const stop = () => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    };

    return { speak, stop };
};