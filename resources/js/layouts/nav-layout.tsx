import { ReactNode } from "react";
import Navbar from "@/pages/navbar";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
    </>
  );
}
