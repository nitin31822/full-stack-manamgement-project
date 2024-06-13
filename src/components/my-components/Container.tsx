import Navbar from "@/components/my-components/Navbar";
export default function Container({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <section className="h-screen w-screen bg-[#ffffff] ">
      <nav>
      <Navbar />
      </nav>
     <main className=" h-screen w-screen p-10">
     {children}
     </main>
      </section>
  }