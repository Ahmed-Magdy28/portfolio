import { motion } from "motion/react";
import { ExternalLink, MessageCircle, Github, Linkedin, Mail, Phone, Facebook } from "lucide-react";
import { cn } from "../ui/utils";
import type { ReactNode } from "react";

const iconMap: Record<string, ReactNode> = {
  github: <Github className="w-6 h-6" />,
  linkedin: <Linkedin className="w-6 h-6" />,
  email: <Mail className="w-6 h-6" />,
  whatsapp: <MessageCircle className="w-6 h-6" />,
  phone: <Phone className="w-6 h-6" />,
  facebook: <Facebook className="w-6 h-6" />,
};

interface ContactMethodProps {
  label: string;
  value: string;
  url: string;
  icon: string;
  variants: any;
}

export const ContactMethod = ({
  label,
  value,
  url,
  icon,
  variants,
}: ContactMethodProps) => {
  const isExternal = url.startsWith("http");
  
  return (
    <motion.a
      variants={variants}
      href={url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="flex items-center gap-5 p-6 rounded-[1.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
         <ExternalLink className="w-4 h-4 text-blue-500/40" />
      </div>
      
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        {iconMap[icon] || <MessageCircle className="w-6 h-6" />}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-black text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-[0.2em] mb-1">
          {label}
        </div>
        <div className="font-black text-lg truncate text-foreground group-hover:translate-x-1 transition-transform">
          {value}
        </div>
      </div>
    </motion.a>
  );
};
