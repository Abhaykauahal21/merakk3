const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;

export const navLinks = [
  { href: "#top", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#studio", label: "Studio" },
  { href: "#team", label: "Team" },
  { href: "#services", label: "Services" },
  { href: "#journal", label: "Journal" },
  { href: "#contact", label: "Contact" },
];

export const heroImage = u("1600585154340-be6161a56a0c", 2200);

export const categories = [
  { n: "01", title: "Residential", img: u("1523217582562-09d0def993a6", 900), alt: "White minimal residence with a lawn" },
  { n: "02", title: "Commercial", img: u("1497366216548-37526070297c", 900), alt: "Calm grey office corridor with glass partitions" },
  { n: "03", title: "Hospitality", img: u("1582268611958-ebfd161ef9cf", 900), alt: "Resort pavilion beside a pool" },
];

export type ProjectCat = "residential" | "commercial" | "hospitality" | "interiors";

export const projects: { title: string; cat: ProjectCat; year: number; img: string; alt: string; wide?: boolean; place: string; area: string }[] = [
  { title: "Corten House", cat: "residential", year: 2025, img: u("1600047509807-ba8f99d2cdde", 1400), alt: "Residence with weathered steel cladding", wide: true , place: "Bhopal", area: "6,200 sq ft" },
  { title: "Linen Apartment", cat: "interiors", year: 2024, img: u("1600607687939-ce8a6c25118c", 900), alt: "Bright open-plan living interior" , place: "Mumbai", area: "2,100 sq ft" },
  { title: "Prism Offices", cat: "commercial", year: 2024, img: u("1487958449943-2429e8be8625", 900), alt: "Angular white facade against the sky" , place: "Bengaluru", area: "48,000 sq ft" },
  { title: "Stillwater Retreat", cat: "hospitality", year: 2023, img: u("1613490493576-7fde63acd811", 900), alt: "Villa with lap pool and timber soffit" , place: "Goa", area: "22 keys" },
  { title: "Terrace Villa", cat: "residential", year: 2023, img: u("1600596542815-ffad4c1539a9", 900), alt: "White modern house with pool" , place: "Indore", area: "5,400 sq ft" },
  { title: "Gallery Residence", cat: "interiors", year: 2025, img: u("1600210492486-724fe5c67fb0", 1400), alt: "Warm living room with timber and art wall", wide: true , place: "Delhi", area: "3,800 sq ft" },
  { title: "Stack Block", cat: "commercial", year: 2022, img: u("1479839672679-a46483c0e7c8", 900), alt: "Stacked white modular building" , place: "Pune", area: "36,000 sq ft" },
];

export const testimonials = [
  { quote: "Merakk transformed our vision into a home that feels timeless. Every detail is thoughtful, functional and beautiful.", by: "Private residence" },
  { quote: "They listened before they drew. The office now feels calm and full of light — our team actually wants to be here.", by: "Workplace interior" },
  { quote: "From the first sketch to the last fixture, the process was clear, honest and on schedule. Guests notice the difference.", by: "Boutique hospitality" },
];

export const steps = [
  { n: "01", title: "Listen", text: "Site visits, brief and budget — we understand how you want to live and work." },
  { n: "02", title: "Concept", text: "Sketches, massing and mood — a clear idea before a single line is fixed." },
  { n: "03", title: "Develop", text: "Detailed drawings, materials, approvals and 3D walkthroughs." },
  { n: "04", title: "Deliver", text: "On-site supervision through to handover, and care long after." },
];

export const stats: { value: number; suffix: string; label: string; decimals?: number }[] = [
  { value: 3, suffix: "+", label: "Years of practice" },
  { value: 150, suffix: "+", label: "Projects delivered" },
  { value: 100, suffix: "+", label: "Happy clients" },
  { value: 24, suffix: "+", label: "Countries" },
];

/** Placeholder contact details — replace with the client's real ones. */
export const contact = {
  email: "merakkstudios@gmail.com",
  phone: "+91 79069 71492",
  phoneHref: "tel:+917906971492",
  /** WhatsApp number in international format, digits only — taken from the phone listed on the client site; confirm it is on WhatsApp */
  whatsapp: "917906971492",
  whatsappText: "Hi Merakk Studios, I'd like to discuss a project.",
  address: "Studio address, City, India",
  hours: "Mon – Sat · 10:00 – 19:00",
};

/* ------------------------------------------------------------------
 * PLACEHOLDER CONTENT — replace with the client's real team, awards,
 * articles and answers before going live. Portraits are stock photos.
 * ------------------------------------------------------------------ */

const face = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop&crop=faces`;

/** Real founders — photos and names from merakkdesigns.com/about */
export const founder = {
  name: "Ar. Karan Lodhi",
  role: "Founder & Principal Architect",
  img: "/team/karan.webp",
  quote:
    "A good building is a quiet promise — to the people inside it, to the street outside it, and to the decades it has to stand through.", // placeholder quote — confirm with client
  credentials: ["Founder, Merakk Studios · Est. 2024", "Architecture · Interiors · Landscape", "150+ projects · 24+ countries"],
};

export const team = [
  { name: "Ar. Khushboo Rajput", role: "Co-Founder & Design Director", img: "/team/khushboo.webp", note: "Shapes the design language of every project." },
  { name: "Ar. Avantika Lodhi", role: "Co-Founder & Creative Lead", img: "/team/avantika.webp", note: "Leads concept, materials and the creative story." },
];

export const awards = [
  { year: 2025, title: "Residential Project of the Year", by: "National Design Awards", project: "Corten House" },
  { year: 2025, title: "Excellence in Sustainable Design", by: "Green Building Forum", project: "Stillwater Retreat" },
  { year: 2024, title: "Best Interior — Residential", by: "Interiors Annual", project: "Linen Apartment" },
  { year: 2024, title: "Emerging Practice of the Year", by: "Architecture Review India", project: "Studio" },
  { year: 2023, title: "Commendation — Workplace", by: "Design Excellence Awards", project: "Prism Offices" },
];

export const publications = ["Design Journal", "Interiors Annual", "The Habitat Review", "Material Matters", "Space & Form", "Built Quarterly"];

export const journal = [
  { tag: "Site diary", date: "Oct 2026", read: "4 min", title: "Day 040 — pouring the ground slab", excerpt: "Why we spend more time on levels and drainage than on anything you will ever see.", img: "/sequence/desktop/0026.webp" },
  { tag: "Process", date: "Sep 2026", read: "6 min", title: "Structure first: columns, beams and honest spans", excerpt: "How the frame decides where the light, the views and the furniture will go.", img: "/sequence/desktop/0044.webp" },
  { tag: "Materials", date: "Aug 2026", read: "5 min", title: "Choosing stone that ages well", excerpt: "Travertine, sandstone, slate — and what Indian sun does to each of them.", img: "/materials/travertine.webp" },
  { tag: "Handover", date: "Jul 2026", read: "3 min", title: "The last 10%: landscape, lighting, handover", excerpt: "The finishing layer that turns a building into a home people want to come back to.", img: "/sequence/desktop/0085.webp" },
];

export const faqs = [
  { q: "What does an architect's fee typically look like?", a: "Most of our projects are billed as a percentage of construction cost or as a fixed fee by stage (concept, design development, working drawings, site supervision). After the first site visit we send a clear written proposal — no surprises later." },
  { q: "How long does a typical home take?", a: "Design and approvals usually take 3–5 months. Construction of an independent home runs 10–16 months depending on size, site and finishes. We share a stage-wise timeline before work begins." },
  { q: "Do you work outside your home city?", a: "Yes. We have delivered projects in India, the US, Africa and Europe. For out-of-city sites we plan fixed site visits and use a local execution partner with weekly photo and video reports." },
  { q: "Can you handle interiors and landscape too?", a: "Yes — architecture, interiors and landscape are designed together in-house, so the house, the rooms and the garden read as one idea." },
  { q: "Will I see the design before construction?", a: "Always. You will review sketches, 3D views and walkthroughs, and a material board with real samples, before a single drawing goes to site." },
  { q: "How do we start?", a: "Send us a WhatsApp or fill the enquiry form with your site location and rough brief. We will set up a call, then a site visit." },
];
