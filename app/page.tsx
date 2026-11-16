import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Approach from "@/components/Approach";
import Statement from "@/components/Statement";
import Featured from "@/components/Featured";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Numbers from "@/components/Numbers";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BeforeAfter from "@/components/BeforeAfter";
import Materials from "@/components/Materials";
import GridGuides from "@/components/GridGuides";
import Team from "@/components/Team";
import Awards from "@/components/Awards";
import Journal from "@/components/Journal";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <>
      <Loader />
      <Nav />
      <GridGuides />
      <main>
        <Hero />
        <Approach />
        <Statement />
        <Team />
        <BeforeAfter />
        <Featured />
        <Projects />
        <Materials />
        <Services />
        <Numbers />
        <Process />
        <Awards />
        <Journal />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
