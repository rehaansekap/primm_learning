
import React from 'react';
const Petunjuk: React.FC = () => {
  return (
    <>
        <section id="guide" className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-5 lg:px-10">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-[#0F828C]">Bagaimana Cara Belajar?</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#78B9B5]">
                      <h3 className="text-xl font-bold mb-2">01. Login/Register</h3>
                      <p className="text-gray-600">Daftar sebagai siswa. Lalu, setelah itu lakukan login</p>
                  </div>
                  <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#78B9B5]">
                      <h3 className="text-xl font-bold mb-2">02. Test</h3>
                      <p className="text-gray-600">Kerjakan Test terlebih dahulu jika baru pertama kali mengakses website.</p>
                  </div>
                  <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#78B9B5]">
                      <h3 className="text-xl font-bold mb-2">03. Course</h3>
                      <p className="text-gray-600">Kerjakan materi dimulai dari materi awal.</p>
                  </div>
                  <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#78B9B5]">
                      <h3 className="text-xl font-bold mb-2">04. Nilai dan Feedback</h3>
                      <p className="text-gray-600">Lihat Nilai dan Feedback dari guru.</p>
                  </div>
              </div>
          </div>
      </section>
    </>
  );
};

export default Petunjuk;
