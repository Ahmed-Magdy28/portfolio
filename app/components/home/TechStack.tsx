import { Link } from "react-router";
import { IconValue } from "../IconValue";
import { Section } from "../Section";

interface TechStackProps {
  lang: string;
  languages: any[];
  frameworks: any[];
  languageSlugs: Set<string>;
}

export const TechStack = ({
  lang,
  languages,
  frameworks,
  languageSlugs,
}: TechStackProps) => {
  return (
    <Section className="py-12 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          {lang === "en" ? "Tech Stack" : "التقنيات"}
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {lang === "en"
            ? "Languages and frameworks I use to build modern web solutions."
            : "اللغات وإطارات العمل التي أستخدمها لبناء حلول ويب حديثة."}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
        {[...languages, ...frameworks].map((tech) => (
          <Link
            key={tech.slug}
            to={
              languageSlugs.has(tech.slug)
                ? `/languages/${tech.slug}`
                : `/frameworks/${tech.slug}`
            }
            className="flex flex-col items-center gap-3 group transition-all"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm group-hover:shadow-md group-hover:border-blue-500/50 group-hover:-translate-y-2 transition-all duration-300">
              <IconValue
                value={tech.icon}
                alt={tech.title}
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
              />
            </div>
            <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
              {tech.title}
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
};
