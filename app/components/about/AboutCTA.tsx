import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

interface AboutCTAProps {
  title: string;
  text: string;
  linkLabel: string;
  linkUrl: string;
}

export const AboutCTA = ({ title, text, linkLabel, linkUrl }: AboutCTAProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="relative mt-24 overflow-hidden rounded-[3rem] bg-linear-to-br from-blue-600 to-purple-700 p-12 text-white shadow-2xl shadow-blue-500/20"
  >
    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[100px] rounded-full -mr-48 -mt-48" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/10 blur-[100px] rounded-full -ml-48 -mb-48" />
    
    <div className="relative z-10 max-w-2xl">
      <h2 className="text-4xl font-black mb-6 tracking-tight">{title}</h2>
      <p className="text-xl text-blue-50 mb-10 leading-relaxed font-medium">
        {text}
      </p>
      <Link
        to={linkUrl}
        className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-2xl font-black text-blue-600 uppercase tracking-widest text-sm hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 group"
      >
        {linkLabel}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  </motion.div>
);
