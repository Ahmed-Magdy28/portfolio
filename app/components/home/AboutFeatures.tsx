import { motion } from "motion/react";
import { Section } from "../Section";
import { Button } from "../Button";
import { IconValue } from "../IconValue";
import { Card, CardContent } from "../ui/card";
import { Globe, ArrowRight } from "lucide-react";

interface AboutFeaturesProps {
  lang: string;
  home: {
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  about: {
    paragraphs: string[];
  };
}

export const AboutFeatures = ({ lang, home, about }: AboutFeaturesProps) => {
  const features = Array.isArray(home.features) ? home.features : [];
  const paragraphs = Array.isArray(about.paragraphs) ? about.paragraphs : [];

  return (
    <Section className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Left Side: Content */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" />
              {lang === "en" ? "Technical Expertise" : "الخبرة التقنية"}
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-[1.1] tracking-tight text-gray-900 dark:text-white">
              {lang === "en"
                ? "Crafting Digital Excellence"
                : "صناعة التميز الرقمي"}
            </h2>

            <div className="space-y-6 text-gray-600 dark:text-gray-400 mb-10 text-lg leading-relaxed">
              {paragraphs.slice(0, 2).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                to="/about"
                variant="primary"
                size="lg"
                className="rounded-xl px-8 font-bold"
              >
                {lang === "en" ? "Learn More" : "تعرف علي أكثر"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                to="/contact"
                variant="outline"
                size="lg"
                className="rounded-xl px-8 font-bold dark:border-white/10 dark:text-white dark:hover:bg-white/5"
              >
                {lang === "en" ? "Let's Talk" : "تواصل معي"}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Features Grid */}
        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={i === 0 ? "sm:col-span-2" : ""}
            >
              <Card className="group border-none bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-none h-full overflow-hidden">
                <CardContent className="p-8">
                  <div className="mb-6 w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-blue-600/20">
                    <IconValue
                      value={feature.icon}
                      alt={feature.title}
                      className="w-6 h-6"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};
