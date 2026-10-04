import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { Button } from "../Button";
import { Section } from "../Section";

interface ContactCTAProps {
  t: any;
  contact: any;
}

export const ContactCTA = ({ t, contact }: ContactCTAProps) => {
  return (
    <Section className="pb-32">
      <div className="relative rounded-[2rem] md:rounded-[4rem] bg-linear-to-br from-blue-600 to-purple-700 p-10 md:p-20 text-center text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] rounded-full -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 blur-[100px] rounded-full -ml-40 -mb-40" />

        <h2 className="text-4xl md:text-6xl font-bold mb-6 relative z-10 tracking-tight">
          {t.contact.title}
        </h2>
        <p className="text-blue-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed">
          {contact.intro}
        </p>

        <div className="flex flex-wrap justify-center gap-5 relative z-10">
          <Button
            to="/contact"
            variant="none"
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 border-none rounded-full px-12 font-bold shadow-xl shadow-black/10 transition-all hover:scale-105 active:scale-95"
          >
            {t.home.contactMe}
          </Button>
          <div className="flex items-center gap-4">
            {contact.links.slice(0, 3).map((link: any) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-all backdrop-blur-md shadow-lg"
                title={link.label}
                aria-label={link.label}
              >
                {link.icon === "github" && (
                  <Github className="w-5 h-5 md:w-6 md:h-6" />
                )}
                {link.icon === "linkedin" && (
                  <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
                )}
                {link.icon === "email" && (
                  <Mail className="w-5 h-5 md:w-6 md:h-6" />
                )}
                {!["github", "linkedin", "email"].includes(link.icon) && (
                  <ExternalLink className="w-5 h-5 md:w-6 md:h-6" />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};
