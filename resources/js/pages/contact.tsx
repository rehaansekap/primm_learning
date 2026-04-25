import React from 'react';
import { Send, MessageCircle, Instagram} from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="w-full min-h-screen bg-[#fcfcfc] flex items-start justify-center p-4 md:p-12 lg:p-28 overflow-hidden">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center -mt-15">
        <div className="lg:col-span-5 space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="flex justify-center lg:justify-start">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
              
              <img 
                src="/SITI NURAENI.jpg" 
                alt="Creator" 
                className="relative w-64 h-80 md:w-65 md:h-80 object-cover rounded-[2rem] shadow-2xl border-2 border-white/50 transform transition duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-12">
          <h2 
            className="text-3xl font-black uppercase tracking-tighter  pr-2"
            style={{
              background: 'linear-gradient(to right, #0F828C, #F7CA89)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'inline-block',
              lineHeight: '1.2', 
              marginBottom: '20px'
            }}
          >
            CONTACT
          </h2>
            <div className="text-center lg:text-left space-y-4 animate-in fade-in slide-in-from-top-6 duration-700 ">
              <div className="flex flex-col gap-3"> 
                <h1 className="text-4xl md:text-5xl lg:text-3xl font-black text-gray-900 tracking-tighter leading-tight">
                  SITI NURAENI<span className="text-teal-500"></span>
                </h1>
                
                <p className="text-teal-600 font-black tracking-[0.3em] uppercase text-s pt-2">
                  DEVELOPER
                </p>
              </div>
              <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-xl pt-4">
              Seorang mahasiswa semester akhir yang sedang mengerjakan skripsi sebagai syarat kelulusan untuk meraih gelar 
                <span className="text-gray-900 font-semibold italic"> Sarjana Pendidikan </span>.
              </p>
            </div>

            <div className="space-y-8  border-gray-100">
              <div className="space-y-5">
              <a href="https://wa.me/6282295233362" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 group w-fit">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-gray-600 font-bold group-hover:text-gray-900 transition-colors">0822-9523-3362</span>
              </a>

              <a href="https://instagram.com/sn.enii24_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 group w-fit">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100 text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                  <Instagram className="w-6 h-6" />
                </div>
                <span className="text-gray-600 font-bold group-hover:text-gray-900 transition-colors">sn.enii24_</span>
              </a>
              </div>
            </div>
        </div> 
      </div>
    </section>
  );
};

export default Contact;