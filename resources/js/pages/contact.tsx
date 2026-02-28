import React from 'react';
import Navbar from '@/layouts/nav-layout';
import Footer from './footer';
import { Send, MessageCircle, Instagram} from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <>
      <Navbar>
        <div className="w-full min-h-screen bg-[#fcfcfc] flex items-center justify-center p-4 md:p-12 lg:p-24">
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="flex justify-center lg:justify-start">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
                  
                  <img 
                    src="/SITI NURAENI.jpg" 
                    alt="Creator" 
                    className="relative w-64 h-80 md:w-72 md:h-96 object-cover rounded-[2rem] shadow-2xl border-2 border-white/50 transform transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              </div>

              <div className="space-y-8 pt-8 border-t border-gray-100">
                <div className="space-y-5">
                  <a href="https://wa.me/6282295233362" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 group w-fit">
                    <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <span className="text-gray-600 font-bold group-hover:text-gray-900 transition-colors">0822-9523-3362</span>
                  </a>

                  <a href="https://instagram.com/sn.anii24_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 group w-fit">
                    <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100 text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                      <Instagram className="w-6 h-6" />
                    </div>
                    <span className="text-gray-600 font-bold group-hover:text-gray-900 transition-colors">sn.anii24_</span>
                  </a>
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

              <div className="relative group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                <div className="absolute -inset-6 bg-white shadow-2xl rounded-[3rem] -z-10 border border-gray-100"></div>

                <form className="space-y-10 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="group space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-teal-600 transition-colors">
                        Nama Lengkap
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-0 py-2 bg-transparent border-b-2 border-[#f4c892] focus:border-teal-500 transition-all outline-none text-gray-800 text-lg font-medium placeholder:text-gray-400 placeholder:font-light" 
                        placeholder="Siapa nama Anda?" 
                      />
                    </div>

                    <div className="group space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-teal-600 transition-colors">
                        No. Telepon
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-0 py-2 bg-transparent border-b-2 border-[#f4c892] focus:border-teal-500 transition-all outline-none text-gray-800 text-lg font-medium placeholder:text-gray-400 placeholder:font-light" 
                        placeholder="08xx-xxxx-xxxx" 
                      />
                    </div>
                  </div>
                  
                  <div className="group space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-teal-600 transition-colors">
                      Pesan Anda
                    </label>
                    <textarea 
                      rows={2} 
                      className="w-full px-0 py-2 bg-transparent border-b-2 border-[#f4c892] focus:border-teal-500 transition-all outline-none text-gray-800 text-lg font-medium placeholder:text-gray-400 placeholder:font-light resize-none" 
                      placeholder="Apa yang bisa saya bantu?"
                    ></textarea>
                  </div>

                  <div className="pt-2 flex justify-center lg:justify-start">
                    <button className="relative inline-flex items-center justify-center px-8 py-5 overflow-hidden font-black text-white transition-all duration-300 bg-[#0F828C] rounded-full group shadow-2xl hover:scale-105 active:scale-95">
                    <span className="absolute inset-0 w-full h-full -mt-1 transition-all duration-300 ease-out transform -translate-x-full bg-[#78B9B5] group-hover:translate-x-0"></span>
                    <span className="relative flex items-center gap-3 tracking-widest text-xs uppercase">
                      Kirim Pesan
                      <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </Navbar>
      <Footer />
    </>
  );
};

export default Contact;