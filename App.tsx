import { useState, useEffect, useRef } from "react";
import {
  Menu, X, ArrowRight, Download, Mail, Phone, ExternalLink,
  ChevronUp, Star, Globe, Monitor, Search, Pencil, Send,
  CheckCircle, Award, Zap, Eye, Layout, Users, FolderOpen,
  Github, Linkedin, MapPin, CheckCheck, MessageSquare, Layers
} from "lucide-react";

// ─── Styles ────────────────────────────────────────────────────────────────────
const G = () => (
  <style>{`
    html { scroll-behavior: smooth; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #F8FAFC; }
    ::-webkit-scrollbar-thumb { background: #4F46E5; border-radius: 99px; }

    @keyframes blob {
      0%,100% { border-radius:60% 40% 30% 70%/60% 30% 70% 40%; }
      33% { border-radius:30% 60% 70% 40%/50% 60% 30% 60%; transform:translate(20px,-30px) scale(1.05); }
      66% { border-radius:40% 70% 50% 60%/30% 50% 70% 60%; transform:translate(-20px,15px) scale(0.95); }
    }
    @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
    @keyframes spinSlow { to{transform:rotate(360deg)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
    @keyframes ripple { 0%{transform:scale(0);opacity:.6} 100%{transform:scale(2.4);opacity:0} }
    @keyframes gradMove { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

    .blob { animation: blob 9s ease-in-out infinite; }
    .blob-d2 { animation-delay: 3s; }
    .blob-d4 { animation-delay: 6s; }
    .float { animation: floatY 5s ease-in-out infinite; }
    .float-d { animation: floatY 5s ease-in-out infinite 1.5s; }
    .spin-slow { animation: spinSlow 22s linear infinite; }
    .grad-move { background-size:200% 200%; animation: gradMove 5s ease infinite; }

    .fade-up { opacity:0; transform:translateY(28px); transition:opacity .7s ease,transform .7s ease; }
    .fade-up.in { opacity:1; transform:translateY(0); }
    .fade-up-d1 { transition-delay:.1s; }
    .fade-up-d2 { transition-delay:.2s; }
    .fade-up-d3 { transition-delay:.3s; }
    .fade-up-d4 { transition-delay:.4s; }
    .fade-up-d5 { transition-delay:.5s; }
    .fade-up-d6 { transition-delay:.6s; }

    .glass {
      background:rgba(255,255,255,.72);
      backdrop-filter:blur(20px);
      -webkit-backdrop-filter:blur(20px);
      border:1px solid rgba(255,255,255,.55);
    }
    .glass-dark {
      background:rgba(79,70,229,.08);
      backdrop-filter:blur(16px);
      -webkit-backdrop-filter:blur(16px);
      border:1px solid rgba(79,70,229,.15);
    }
    .grad-text {
      background:linear-gradient(135deg,#4F46E5 0%,#8B5CF6 55%,#06B6D4 100%);
      -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    }
    .card-lift { transition:transform .3s ease,box-shadow .3s ease; }
    .card-lift:hover { transform:translateY(-8px); box-shadow:0 24px 48px rgba(79,70,229,.13); }

    .proj-img { transition:transform .4s ease; }
    .proj-card:hover .proj-img { transform:scale(1.06); }
    .proj-overlay { opacity:0; transition:opacity .35s ease; background:linear-gradient(to top,rgba(15,10,40,.92) 0%,rgba(15,10,40,.4) 60%,transparent 100%); }
    .proj-card:hover .proj-overlay { opacity:1; }

    .gal-overlay { opacity:0; transition:opacity .3s ease; background:linear-gradient(to top,rgba(79,70,229,.9) 0%,rgba(79,70,229,.5) 50%,transparent 100%); }
    .gal-img { transition:transform .4s ease; }
    .gal-item:hover .gal-overlay { opacity:1; }
    .gal-item:hover .gal-img { transform:scale(1.06); }

    .skill-bar { transition:width 1.4s cubic-bezier(.4,0,.2,1); }
    .ripple-btn { position:relative; overflow:hidden; }
    .ripple-btn::after { content:''; position:absolute; inset:0; background:rgba(255,255,255,.3); border-radius:inherit; transform:scale(0); opacity:0; }
    .ripple-btn:active::after { animation:ripple .5s ease-out; }

    .process-line { background:linear-gradient(to bottom,#4F46E5,#8B5CF6,#06B6D4); }
  `}</style>
);

// ─── Data ──────────────────────────────────────────────────────────────────────
const SKILLS = [
  { name: "Figma", level: 95, abbr: "Fi", color: "#A259FF" },
  { name: "Adobe Photoshop", level: 90, abbr: "Ps", color: "#31A8FF" },
  { name: "Adobe Illustrator", level: 88, abbr: "Ai", color: "#FF9A00" },
  { name: "Adobe XD", level: 85, abbr: "Xd", color: "#FF61F6" },
  { name: "Framer", level: 80, abbr: "Fr", color: "#0055FF" },
  { name: "WordPress", level: 75, abbr: "Wp", color: "#21759B" },
  { name: "Elementor", level: 78, abbr: "El", color: "#92003B" },
  { name: "HTML & CSS", level: 85, abbr: "H5", color: "#E34F26" },
  { name: "Responsive Design", level: 92, abbr: "Rp", color: "#06B6D4" },
  { name: "Design Systems", level: 90, abbr: "DS", color: "#4F46E5" },
  { name: "Wireframing", level: 95, abbr: "Wf", color: "#6B7280" },
  { name: "Prototyping", level: 88, abbr: "Pt", color: "#10B981" },
  { name: "User Research", level: 85, abbr: "UR", color: "#8B5CF6" },
  { name: "Framer Motion", level: 72, abbr: "Fm", color: "#F59E0B" },
];

const PROJECTS = [
  { id: 1, title: "HealthTrack Mobile App", category: "Mobile App", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=680&h=440&fit=crop&auto=format", problem: "Fragmented health data across 5+ apps creating a disjointed wellness journey.", solution: "Unified dashboard with smart visualization and personalized insights engine.", tools: ["Figma", "ProtoPie", "Maze"], duration: "8 wks", color: "#4F46E5" },
  { id: 2, title: "FinFlow Dashboard", category: "Dashboard", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=680&h=440&fit=crop&auto=format", problem: "Analysts spent hours extracting insights from dense spreadsheets.", solution: "Real-time dashboard with customizable widgets and one-click PDF reports.", tools: ["Figma", "Principle", "Zeplin"], duration: "10 wks", color: "#06B6D4" },
  { id: 3, title: "MediCare Hospital Platform", category: "Healthcare", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=680&h=440&fit=crop&auto=format", problem: "Confusing booking flows with 68% abandonment rate.", solution: "Simplified 3-step booking flow with telemedicine integration.", tools: ["Adobe XD", "InVision", "Hotjar"], duration: "12 wks", color: "#8B5CF6" },
  { id: 4, title: "LuxCart E-commerce", category: "E-commerce", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=680&h=440&fit=crop&auto=format", problem: "Luxury brand needed a digital presence matching their premium stores.", solution: "Editorial shopping experience with micro-interactions and seamless checkout.", tools: ["Figma", "Framer", "Shopify"], duration: "14 wks", color: "#F59E0B" },
  { id: 5, title: "Wanderlust Travel App", category: "Travel App", image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=680&h=440&fit=crop&auto=format", problem: "Travel planning fragmented across 5+ apps causing decision fatigue.", solution: "AI-powered companion aggregating flights, hotels, and experiences.", tools: ["Figma", "ProtoPie", "UserTesting"], duration: "16 wks", color: "#10B981" },
  { id: 6, title: "NexaCloud SaaS Platform", category: "SaaS Platform", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=680&h=440&fit=crop&auto=format", problem: "Onboarding completion at 23% due to feature overload.", solution: "Progressive disclosure with personalized setup wizard and smart tooltips.", tools: ["Figma", "Fullstory", "Mixpanel"], duration: "20 wks", color: "#EF4444" },
];

const GALLERY = [
  { title: "Nexus Brand Identity", cat: "Branding", img: "photo-1561070791-2526d30994b5", h: 220 },
  { title: "Apex Logo System", cat: "Logo Design", img: "photo-1558655146-9f40138edfeb", h: 170 },
  { title: "Social Campaign Series", cat: "Social Media", img: "photo-1611162617213-7d7a39e9b1d7", h: 260 },
  { title: "TechConf 2024 Banner", cat: "Event Banners", img: "photo-1540575467063-178a50c2df87", h: 190 },
  { title: "Global Summit Branding", cat: "Conference", img: "photo-1551836022-deb4988cc6c0", h: 155 },
  { title: "Excellence Certificate", cat: "Certificates", img: "photo-1589829085413-56de8ae18c73", h: 235 },
  { title: "Product Launch Flyer", cat: "Flyers", img: "photo-1586281380349-632531db7ed4", h: 185 },
  { title: "Urban Culture Poster", cat: "Posters", img: "photo-1507238691740-187a5b1d37b8", h: 255 },
  { title: "Annual Report Brochure", cat: "Brochures", img: "photo-1562577309-4932fdd64cd1", h: 170 },
  { title: "Brand Rollup Standee", cat: "Roll-up Standees", img: "photo-1558618666-fcd25c85cd64", h: 215 },
  { title: "Newsletter Campaign", cat: "Email Campaigns", img: "photo-1563986768494-4dee2763ff3f", h: 155 },
  { title: "Investor Pitch Deck", cat: "Presentations", img: "photo-1454165804606-c3d57bc86b40", h: 195 },
];

const PROCESS = [
  { Icon: Search, label: "Discover", desc: "Deep-dive into user needs and business goals through stakeholder interviews and competitive analysis." },
  { Icon: Eye, label: "Research", desc: "Synthesize findings with affinity maps, user personas, and journey maps." },
  { Icon: Layout, label: "Wireframe", desc: "Sketch low-fidelity structures to explore possibilities before visual design." },
  { Icon: Monitor, label: "Prototype", desc: "Build interactive prototypes and validate flows with real users early." },
  { Icon: Pencil, label: "Design", desc: "Craft pixel-perfect UI balancing accessibility, hierarchy, and brand." },
  { Icon: CheckCheck, label: "Test", desc: "Run usability studies, A/B experiments, and accessibility audits." },
  { Icon: Zap, label: "Deliver", desc: "Hand off production assets with full specs, component libraries, and docs." },
];

const EXPERIENCE = [
  { role: "Senior UI/UX Designer", company: "TechVision Studios", loc: "San Francisco, CA", period: "2022 — Present", items: ["Led design for 3 flagship SaaS products, boosting retention 45%", "Built a 200+ component design system across 5 product teams", "Mentored junior designers and ran weekly design critique sessions"], tools: ["Figma", "Framer", "ProtoPie", "Amplitude"], color: "#4F46E5" },
  { role: "UI/UX Designer", company: "Pixel & Code Agency", loc: "New York, NY", period: "2020 — 2022", items: ["Designed end-to-end experiences for 18 client projects in fintech and healthcare", "Reduced onboarding drop-off 52% through iterative redesign", "Ensured pixel-perfect implementation in close collaboration with engineers"], tools: ["Adobe XD", "Sketch", "InVision", "Hotjar"], color: "#06B6D4" },
  { role: "Graphic Designer", company: "CreativeEdge Co.", loc: "Austin, TX", period: "2018 — 2020", items: ["Produced brand identities and marketing collateral for 40+ clients", "Developed visual guidelines and brand books for 12 identity systems", "Grew social media engagement 180% across 8 client accounts"], tools: ["Illustrator", "Photoshop", "InDesign"], color: "#8B5CF6" },
  { role: "Junior Designer", company: "BrandWorks Studio", loc: "Chicago, IL", period: "2017 — 2018", items: ["Assisted senior designers on branding and web projects", "Created social graphics, decks, and promotional materials", "Participated in UX research sessions and usability testing"], tools: ["Photoshop", "Illustrator", "PowerPoint"], color: "#F59E0B" },
];

const TESTIMONIALS = [
  { name: "Sarah Mitchell", role: "CEO, HealthTrack Inc.", img: "https://images.unsplash.com/photo-1580489944761-15a19d674579?w=140&h=140&fit=crop&auto=format", text: "Working with Alex completely transformed our product. User engagement increased 340% post-redesign and our investors noticed immediately. Every decision had clear strategic thinking behind it." },
  { name: "James Okonkwo", role: "Founder, ShopFlow", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=140&h=140&fit=crop&auto=format", text: "Alex doesn't just design screens — they design experiences. Our conversion rates doubled within the first month of the new checkout flow. I couldn't recommend them more." },
  { name: "Priya Sharma", role: "Marketing Director, NexaCloud", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=140&h=140&fit=crop&auto=format", text: "The brand identity and pitch deck Alex delivered exceeded every expectation. Pure creative excellence combined with deep market understanding. Our Series A closed at 2× the expected valuation." },
];

// ─── Hooks ─────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function SectionTag({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="h-px w-10 bg-primary/60 block" />
      <span className="text-xs font-semibold tracking-widest uppercase text-primary">{label}</span>
    </div>
  );
}

// ─── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Home", id: "home" }, { label: "About", id: "about" },
    { label: "Projects", id: "projects" }, { label: "Graphic Designs", id: "graphic-designs" },
    { label: "Experience", id: "experience" }, { label: "Skills", id: "skills" },
    { label: "Testimonials", id: "testimonials" }, { label: "Contact", id: "contact" },
  ];
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setOpen(false); };

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "glass shadow-sm py-0" : "bg-transparent py-2"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => go("home")} className="font-display font-bold text-xl tracking-tight">
          <span className="grad-text">Iswarya</span><span className="text-foreground"> R</span>
        </button>
        <div className="hidden xl:flex items-center gap-6">
          {links.map(l => (
            <button key={l.id} onClick={() => go(l.id)} className="text-[13px] font-medium text-muted-foreground hover:text-primary transition-colors duration-200">
              {l.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a href="#contact" onClick={e => { e.preventDefault(); go("contact"); }} className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-[13px] font-semibold hover:bg-[#4338CA] transition-colors ripple-btn">
            <Download className="w-3.5 h-3.5" /> Resume
          </a>
          <button onClick={() => setOpen(!open)} className="xl:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="xl:hidden glass border-t border-white/40 px-6 pt-3 pb-5 grid grid-cols-2 gap-2">
          {links.map(l => (
            <button key={l.id} onClick={() => go(l.id)} className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors py-2">
              {l.label}
            </button>
          ))}
          <div className="col-span-2 mt-2">
            <a href="#" className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold">
              <Download className="w-3.5 h-3.5" /> Download Resume
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-[#EEF2FF] to-[#F0FDFF]">
      {/* Animated blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-[#4F46E5]/10" />
        <div className="blob blob-d2 absolute top-1/2 -right-40 w-[480px] h-[480px] rounded-full bg-[#8B5CF6]/10" />
        <div className="blob blob-d4 absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/10" />
        <div className="spin-slow absolute top-20 right-1/4 w-[280px] h-[280px] rounded-full border border-dashed border-[#4F46E5]/15" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div style={{ animationName: "fadeUp", animationDuration: ".8s", animationFillMode: "both" }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-[#4F46E5] text-xs font-semibold tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            Available for new projects
          </div>
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-[68px] leading-[1.1] tracking-tight text-foreground mb-6">
            Crafting Digital{" "}
            <span className="grad-text">Experiences</span>
            {" "}That Matter
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mb-8">
            UI/UX Designer & Graphic Designer with 6+ years creating user-centered digital products.
            I blend strategy, research, and visual craft to build interfaces that delight users and drive results.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-[#4338CA] transition-all hover:shadow-lg hover:shadow-primary/30 ripple-btn">
              View Portfolio <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border-2 border-primary/30 text-primary font-semibold text-sm hover:border-primary hover:bg-primary/5 transition-all">
              Hire Me
            </button>
          </div>
          <div className="flex items-center gap-6">
            {[
              { href: "https://linkedin.com", Icon: Linkedin, label: "LinkedIn" },
              { href: "https://github.com", Icon: Github, label: "GitHub" },
              { href: "https://dribbble.com", Icon: Globe, label: "Dribbble" },
            ].map(s => (
              <a key={s.label} href={s.href} aria-label={s.label} className="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                <s.Icon className="w-4 h-4" />
              </a>
            ))}
            <span className="text-muted-foreground text-sm ml-2">Find me on</span>
          </div>
        </div>

        {/* Right — portrait + floating cards */}
        <div className="relative flex justify-center lg:justify-end" style={{ animationName: "fadeUp", animationDuration: ".8s", animationDelay: ".2s", animationFillMode: "both" }}>
          {/* Portrait */}
          <div className="relative">
            <div className="relative w-[320px] sm:w-[380px] h-[380px] sm:h-[440px]">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#4F46E5] via-[#8B5CF6] to-[#06B6D4] p-1 shadow-2xl shadow-primary/25">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&h=600&fit=crop&auto=format"
                  alt="Iswarya R — UI/UX Designer"
                  className="w-full h-full object-cover rounded-[2.3rem] bg-muted"
                />
              </div>
              {/* Rotating ring */}
              <div className="spin-slow absolute -inset-5 rounded-[3rem] border-2 border-dashed border-primary/20" />
            </div>

            {/* Floating card: Projects */}
            <div className="float absolute -left-8 top-12 glass rounded-2xl px-4 py-3 shadow-xl shadow-primary/10 min-w-[140px]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-display font-bold text-lg text-foreground leading-none">150+</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Projects Done</div>
                </div>
              </div>
            </div>

            {/* Floating card: Happy Clients */}
            <div className="float-d absolute -right-8 bottom-16 glass rounded-2xl px-4 py-3 shadow-xl shadow-accent/10 min-w-[150px]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="font-display font-bold text-lg text-foreground leading-none">80+</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Happy Clients</div>
                </div>
              </div>
            </div>

            {/* Floating badge: Top Designer */}
            <div className="float absolute right-0 top-6 glass rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
              <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
              <span className="text-xs font-semibold text-foreground">Top Designer '24</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-muted-foreground/60 to-transparent" />
      </div>
    </section>
  );
}

// ─── About ─────────────────────────────────────────────────────────────────────
function About() {
  const { ref, inView } = useInView();
  const stats = [
    { value: "150+", label: "Projects Completed", Icon: FolderOpen, color: "#4F46E5" },
    { value: "80+", label: "Happy Clients", Icon: Users, color: "#06B6D4" },
    { value: "6+", label: "Years Experience", Icon: Award, color: "#8B5CF6" },
    { value: "12+", label: "Industries Worked", Icon: Globe, color: "#10B981" },
  ];
  return (
    <section id="about" className="py-28 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className={`fade-up ${inView ? "in" : ""}`}>
          <SectionTag label="About Me" />
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground leading-tight mb-6">
            Designing with{" "}<span className="grad-text">Purpose</span> & Precision
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-5">
            I'm Iswarya R — a multidisciplinary UI/UX and Graphic Designer based in San Francisco with over 6 years crafting digital experiences that balance aesthetic beauty with real-world function.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-5">
            My practice spans product design, brand identity, and scalable design systems. I've collaborated with early-stage startups, boutique agencies, and Fortune 500 companies across fintech, healthcare, e-commerce, and SaaS.
          </p>
          <div className="p-5 rounded-2xl bg-secondary border border-primary/10 mb-8">
            <p className="text-[15px] text-foreground leading-relaxed italic font-display">
              "Great design is invisible — it guides users effortlessly toward their goals while leaving them with a feeling they can't quite name but don't want to lose."
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {["User-Centered Thinking", "Design Systems", "Brand Strategy", "Accessibility"].map(tag => (
              <span key={tag} className="px-4 py-1.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">{tag}</span>
            ))}
          </div>
        </div>

        {/* Right — Stats */}
        <div className={`grid grid-cols-2 gap-5 fade-up fade-up-d2 ${inView ? "in" : ""}`}>
          {stats.map(s => (
            <div key={s.label} className="card-lift p-6 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/20">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${s.color}15` }}>
                <s.Icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div className="font-display font-bold text-4xl text-foreground mb-1">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Skills ────────────────────────────────────────────────────────────────────
function Skills() {
  const { ref, inView } = useInView();
  return (
    <section id="skills" className="py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 fade-up ${inView ? "in" : ""}`}>
          <SectionTag label="Skills & Tools" />
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground">My Toolkit</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">14 tools and disciplines I use to take a product from concept to pixel-perfect delivery.</p>
        </div>
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SKILLS.map((sk, i) => (
            <div key={sk.name} className={`card-lift p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/20 fade-up fade-up-d${Math.min(i % 4 + 1, 6)} ${inView ? "in" : ""}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold font-display shrink-0" style={{ background: sk.color }}>
                  {sk.abbr}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{sk.name}</div>
                  <div className="text-xs text-muted-foreground">{sk.level}% proficiency</div>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full skill-bar"
                  style={{ width: inView ? `${sk.level}%` : "0%", background: `linear-gradient(90deg, ${sk.color}, ${sk.color}99)` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Projects ──────────────────────────────────────────────────────────────────
function Projects() {
  const { ref, inView } = useInView();
  return (
    <section id="projects" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 fade-up ${inView ? "in" : ""}`}>
          <SectionTag label="Featured Work" />
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground">UI/UX Case Studies</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Six end-to-end product design projects — from problem discovery through shipped interfaces.</p>
        </div>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
          {PROJECTS.map((p, i) => (
            <div key={p.id} className={`proj-card group rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:border-primary/20 card-lift cursor-pointer fade-up fade-up-d${Math.min(i % 3 + 1, 6)} ${inView ? "in" : ""}`}>
              {/* Image */}
              <div className="relative h-52 overflow-hidden bg-muted">
                <img src={p.image} alt={p.title} className="proj-img w-full h-full object-cover" />
                <div className="proj-overlay absolute inset-0 flex flex-col justify-end p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {p.tools.map(t => (
                      <span key={t} className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-white border border-white/30">{t}</span>
                    ))}
                  </div>
                  <p className="text-white/90 text-xs leading-relaxed">{p.solution}</p>
                </div>
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-bold text-white" style={{ background: p.color }}>
                  {p.category}
                </span>
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[11px] font-semibold glass text-foreground">
                  {p.duration}
                </span>
              </div>
              {/* Body */}
              <div className="p-5">
                <h3 className="font-display font-bold text-lg text-foreground mb-3">{p.title}</h3>
                <div className="mb-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Problem</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.problem}</p>
                </div>
                <button className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all group/btn">
                  View Case Study <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Graphic Design Gallery ────────────────────────────────────────────────────
function GraphicDesigns() {
  const { ref, inView } = useInView();
  const cats = ["All", ...Array.from(new Set(GALLERY.map(g => g.cat)))];
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? GALLERY : GALLERY.filter(g => g.cat === active);

  return (
    <section id="graphic-designs" className="py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-10 fade-up ${inView ? "in" : ""}`}>
          <SectionTag label="Graphic Design" />
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground">Design Portfolio</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Branding, print, and digital design work spanning 12 creative disciplines.</p>
        </div>
        {/* Filter */}
        <div ref={ref} className={`flex flex-wrap gap-2 justify-center mb-10 fade-up fade-up-d1 ${inView ? "in" : ""}`}>
          {cats.map(c => (
            <button key={c} onClick={() => setActive(c)} className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${active === c ? "bg-primary text-white shadow-md shadow-primary/30" : "bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-primary"}`}>
              {c}
            </button>
          ))}
        </div>
        {/* Masonry */}
        <div className={`columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 fade-up fade-up-d2 ${inView ? "in" : ""}`}>
          {filtered.map(g => (
            <div key={g.title} className="gal-item break-inside-avoid mb-5 rounded-2xl overflow-hidden relative cursor-pointer shadow-sm bg-muted">
              <img
                src={`https://images.unsplash.com/${g.img}?w=400&h=${g.h}&fit=crop&auto=format`}
                alt={g.title}
                className="gal-img w-full block"
                style={{ height: g.h }}
              />
              <div className="gal-overlay absolute inset-0 flex flex-col justify-end p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 mb-1">{g.cat}</span>
                <span className="font-display font-semibold text-white text-sm">{g.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Design Process ────────────────────────────────────────────────────────────
function Process() {
  const { ref, inView } = useInView();
  return (
    <section id="process" className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 fade-up ${inView ? "in" : ""}`}>
          <SectionTag label="How I Work" />
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground">Design Process</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">A structured, human-centered process that turns ambiguity into clarity and clarity into craft.</p>
        </div>
        <div ref={ref} className="relative">
          {/* Horizontal line on large screens */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px process-line opacity-20" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
            {PROCESS.map((step, i) => (
              <div key={step.label} className={`relative flex flex-col items-center text-center fade-up fade-up-d${Math.min(i + 1, 6)} ${inView ? "in" : ""}`}>
                {/* Step number */}
                <div className="relative mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, #4F46E5, #8B5CF6)` }}>
                    <step.Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-background border-2 border-primary text-[10px] font-bold text-primary flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display font-bold text-sm text-foreground mb-2">{step.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed hidden lg:block">{step.desc}</p>
                <p className="text-xs text-muted-foreground leading-relaxed lg:hidden">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Experience ────────────────────────────────────────────────────────────────
function Experience() {
  const { ref, inView } = useInView();
  return (
    <section id="experience" className="py-28 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className={`text-center mb-16 fade-up ${inView ? "in" : ""}`}>
          <SectionTag label="Career" />
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground">Work Experience</h2>
        </div>
        <div ref={ref} className="relative">
          <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-px process-line opacity-25" />
          <div className="space-y-10">
            {EXPERIENCE.map((exp, i) => (
              <div key={exp.company} className={`relative pl-14 sm:pl-16 fade-up fade-up-d${Math.min(i + 1, 5)} ${inView ? "in" : ""}`}>
                {/* Timeline dot */}
                <div className="absolute left-3 sm:left-4 top-5 w-5 h-5 rounded-full border-2 border-white shadow-md" style={{ background: exp.color }} />
                <div className="card-lift p-6 sm:p-7 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/20">
                  <div className="flex flex-wrap items-start gap-3 justify-between mb-4">
                    <div>
                      <h3 className="font-display font-bold text-lg text-foreground">{exp.role}</h3>
                      <div className="flex items-center gap-4 mt-1 flex-wrap">
                        <span className="text-sm font-semibold" style={{ color: exp.color }}>{exp.company}</span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3" />{exp.loc}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary text-primary shrink-0">{exp.period}</span>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {exp.items.map(item => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {exp.tools.map(t => (
                      <span key={t} className="px-3 py-1 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border border-border">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const { ref, inView } = useInView();
  return (
    <section id="testimonials" className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#EEF2FF 0%,#F0FDFF 100%)" }}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#4F46E5]/8" />
        <div className="blob blob-d2 absolute bottom-0 left-0 w-60 h-60 rounded-full bg-[#06B6D4]/8" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 fade-up ${inView ? "in" : ""}`}>
          <SectionTag label="Testimonials" />
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground">What Clients Say</h2>
        </div>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className={`glass card-lift rounded-2xl p-7 shadow-xl shadow-primary/5 fade-up fade-up-d${i + 1} ${inView ? "in" : ""}`}>
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                ))}
              </div>
              <p className="text-[15px] text-foreground leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.img} alt={t.name} className="w-11 h-11 rounded-full object-cover bg-muted" />
                <div>
                  <div className="font-semibold text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const { ref, inView } = useInView();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };
  const links = [
    { label: "alex@portfolio.com", Icon: Mail, href: "mailto:alex@portfolio.com" },
    { label: "+1 (415) 555-0182", Icon: Phone, href: "tel:+14155550182" },
    { label: "linkedin.com/in/alex-rivera", Icon: Linkedin, href: "https://linkedin.com" },
    { label: "behance.net/alex-rivera", Icon: Globe, href: "https://behance.net" },
    { label: "dribbble.com/alex-rivera", Icon: Layers, href: "https://dribbble.com" },
    { label: "github.com/alex-rivera", Icon: Github, href: "https://github.com" },
  ];

  return (
    <section id="contact" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left */}
        <div className={`fade-up ${inView ? "in" : ""}`}>
          <SectionTag label="Contact" />
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground leading-tight mb-5">
            Let's Build Something{" "}<span className="grad-text">Great Together</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10">
            Open to freelance projects, full-time roles, and collaborative opportunities. If you have a vision, let's bring it to life.
          </p>
          <div className="space-y-4">
            {links.map(l => (
              <a key={l.label} href={l.href} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                  <l.Icon className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{l.label}</span>
              </a>
            ))}
          </div>
          <div className="mt-10">
            <a href="#" className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-foreground text-white font-semibold text-sm hover:bg-foreground/80 transition-all ripple-btn">
              <Download className="w-4 h-4" /> Download Resume
            </a>
          </div>
        </div>

        {/* Form */}
        <div ref={ref} className={`fade-up fade-up-d2 ${inView ? "in" : ""}`}>
          <div className="p-8 sm:p-10 rounded-3xl bg-background border border-border shadow-sm">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-2">Message Sent!</h3>
                <p className="text-muted-foreground text-sm">Thanks for reaching out. I'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-2">Full Name</label>
                    <input name="name" value={form.name} onChange={handle} required placeholder="Iswarya R" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-2">Email Address</label>
                    <input name="email" type="email" value={form.email} onChange={handle} required placeholder="you@company.com" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Subject</label>
                  <input name="subject" value={form.subject} onChange={handle} required placeholder="Project Collaboration / Full-time Role" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Message</label>
                  <textarea name="message" value={form.message} onChange={handle} required rows={5} placeholder="Tell me about your project, timeline, and budget..." className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all resize-none" />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-[#4338CA] transition-all hover:shadow-lg hover:shadow-primary/30 ripple-btn">
                  Send Message <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer({ onTop }: { onTop: () => void }) {
  const socials = [
    { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { Icon: Github, href: "https://github.com", label: "GitHub" },
    { Icon: Globe, href: "https://dribbble.com", label: "Dribbble" },
    { Icon: ExternalLink, href: "https://behance.net", label: "Behance" },
    { Icon: MessageSquare, href: "#contact", label: "Contact" },
  ];
  return (
    <footer className="bg-foreground py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="font-display font-bold text-xl text-white mb-1">Iswarya R</div>
          <div className="text-sm text-white/50">UI/UX Designer & Graphic Designer</div>
        </div>
        <div className="flex items-center gap-3">
          {socials.map(s => (
            <a key={s.label} href={s.href} aria-label={s.label} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white transition-all">
              <s.Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-6 text-sm text-white/40">
          <span>© Iswarya R 2026. All rights reserved.</span>
          <button onClick={onTop} aria-label="Back to top" className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white hover:bg-[#4338CA] transition-colors">
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 40); setShowTop(window.scrollY > 500); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <G />
      <Nav scrolled={scrolled} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <GraphicDesigns />
      <Process />
      <Experience />
      <Testimonials />
      <Contact />
      <Footer onTop={toTop} />

      {/* Back to top */}
      <button
        onClick={toTop}
        aria-label="Back to top"
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-white shadow-lg shadow-primary/40 flex items-center justify-center hover:bg-[#4338CA] transition-all z-40 ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
}
