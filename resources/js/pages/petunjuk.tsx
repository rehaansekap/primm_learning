
import React from 'react';
import Navbar from'@/layouts/nav-layout';
import Footer from './footer';
const Petunjuk: React.FC = () => {
  return (
    <>
    <Navbar>
    <div className="p-30">
      <h1 className="text-center text-2xl font-bold mb-4">PETUNJUK PENGGUNAAN MEDIA</h1>
      <p>Perhatikan langkah-langkah berikut ini.</p>
    </div>
    </Navbar>
     <Footer />
    </>
  );
};

export default Petunjuk;
