import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Badge } from "../ui/badge";
import { Button } from "../Button";
import { ArrowRight, Download, Sparkles, MousePointer2 } from "lucide-react";
import { Section } from "../Section";

interface HeroProps {
  t: any;
  home: any;
}

const isImageLike = (value?: string) =>
  value
    ? /^https?:\/\//.test(value) ||
      /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(value)
    : false;

export const Hero = ({ t, home }: HeroProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const AvatarContent = () => (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-56 h-56 md:w-72 md:h-72 group"
    >
      <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-tr from-blue-600 to-indigo-600 blur-3xl opacity-10 group-hover:opacity-30 transition-opacity" />
      
      <div 
        style={{ transform: "translateZ(30px)" }}
        className="relative h-full w-full rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl bg-gray-900 ring-1 ring-white/5"
      >
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-50" />
        {isImageLike(home.avatar) ? (
          <img
            src={home.avatar}
            alt={home.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl select-none">
            {home.avatar || "👨‍💻"}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <Section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32 min-h-[90vh] flex flex-col justify-center">
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 dark:opacity-30">
           <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse" />
           <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px] animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left rtl:lg:text-right">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] border border-blue-100/50 dark:border-blue-800/50 backdrop-blur-md"
          >
             <Sparkles className="w-2.5 h-2.5" /> {t.home.title}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-foreground"
          >
            {home.name.split(" ").map((word: string, i: number) => (
                <span key={i} className={i === home.name.split(" ").length - 1 ? "text-blue-600 dark:text-blue-500" : ""}>
                    {word}{" "}
                </span>
            ))}
          </motion.h1>

          {/* Mobile Image Placement: Under the name */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:hidden my-12"
          >
            <AvatarContent />
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed font-medium opacity-90"
          >
            {t.home.intro}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-5"
          >
            <Button
              to="/projects"
              variant="primary"
              className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-600/10 transition-all group"
            >
              {t.home.viewProjects}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Button>
            <Button
              href={home.cvUrl}
              external
              variant="outline"
              className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[11px] border-2 transition-all dark:border-white/10 dark:text-white dark:hover:bg-white/5"
            >
              <Download className="w-4 h-4 mr-2" /> {t.home.downloadCV}
            </Button>
          </motion.div>
        </div>

        {/* Desktop Image Placement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="hidden lg:flex lg:col-span-5 relative justify-center lg:justify-end perspective-[1200px]"
        >
          <AvatarContent />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex justify-center p-1"
        >
          <div className="w-1 h-2 bg-blue-600 rounded-full" />
        </motion.div>
      </motion.div>
    </Section>
  );
};
