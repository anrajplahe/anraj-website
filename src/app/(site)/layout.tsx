
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <div className="flex w-full flex-1 flex-col">
        {children}
      </div>

      <Footer />
    </>
  );
}
