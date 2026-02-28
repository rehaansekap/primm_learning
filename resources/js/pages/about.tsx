import React from 'react';
import Navbar from'@/layouts/nav-layout';
import Footer from './footer';

const About: React.FC = () => {
  return (
    <>
    <Navbar>
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tentang</h1>
      <p>Ini halaman About. Kamu bisa menulis info tentang website di sini.apa saja</p>
    </div>
    </Navbar>
    <Footer />
    </>
  );
};

export default About;
