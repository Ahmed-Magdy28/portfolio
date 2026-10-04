import { Link } from "../Link";
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

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 max-w-6xl mx-auto px-4">
        {[...languages, ...frameworks].map((tech) => (
          <Link
            key={tech.slug}
            to={
              languageSlugs.has(tech.slug)
                ? `/languages/${tech.slug}`
                : `/frameworks/${tech.slug}`
            }
            className="flex items-center gap-3 px-4 sm:px-5 py-3 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/90 dark:border-gray-700/80 shadow-xs hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <IconValue
                value={tech.icon}
                alt={tech.title}
                className="w-7 h-7 object-contain"
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {tech.title}
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
};
