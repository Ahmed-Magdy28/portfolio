import { motion } from "motion/react";
import { PageAdminEditor } from "../components/admin/PageAdminEditor";
import { Section } from "../components/Section";
import { Button } from "../components/Button";
import { useAdminSession } from "../hooks/useAdminSession";
import { useContactForm } from "../hooks/useContactForm";
import { useRootData } from "../hooks/useRootData";
import { useSiteContent } from "../hooks/useSiteContent";
import { useTranslation } from "../i18n/useTranslation";
import { PageSEO } from "../components/PageSEO";
import { AdminSectionWrapper } from "../components/admin/AdminSectionWrapper";
import { ContactMethod } from "../components/contact/ContactMethod";
import { 
  Send,
  CheckCircle2,
  AlertCircle,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export const Contact = () => {
  const { t, lang } = useTranslation();
  const { contact } = useSiteContent();
  const { isAdminAuthenticated } = useAdminSession();
  const rootData = useRootData();
  const { formData, handleChange, handleSubmit, status } = useContactForm();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, type: "spring" as const } },
  };

  const seoTitle = "Contact Ahmed Magdy | Get in Touch";
  const seoDescription = "Have a project in mind or want to collaborate? Contact Ahmed Magdy, a Frontend Web Developer based in Cairo, Egypt.";

  return (
    <div className="relative overflow-hidden pt-24 pb-32">
      <PageSEO
        title={seoTitle}
        description={seoDescription}
        url={`${rootData.siteUrl}/contact`}
      />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -mr-64 -mt-64 -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full -ml-64 -mb-64 -z-10" />

      <Section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 text-[10px] font-black uppercase tracking-widest">
              {lang === 'en' ? 'Open for collaboration' : 'متاح للتعاون'}
            </Badge>
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter bg-linear-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
              {t.contact.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              {contact.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <motion.div className="lg:col-span-7" variants={itemVariants} initial="hidden" animate="visible">
              <Card className="border-gray-100 dark:border-gray-800 shadow-2xl shadow-blue-500/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl overflow-hidden rounded-[2.5rem]">
                <CardHeader className="p-10 border-b border-gray-50 dark:border-gray-800">
                  <CardTitle className="text-3xl font-black tracking-tight">{lang === 'en' ? 'Send a Message' : 'أرسل رسالة'}</CardTitle>
                  <CardDescription className="text-base font-medium">
                    {lang === 'en' ? "I usually respond within a few hours." : "أقوم بالرد عادة خلال ساعات قليلة."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          {t.contact.name}
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 text-foreground focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all outline-none font-bold"
                          placeholder={lang === 'en' ? "Your Name" : "اسمك"}
                        />
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          {t.contact.email}
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 text-foreground focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all outline-none font-bold"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {t.contact.message}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 text-foreground focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all outline-none resize-none font-medium leading-relaxed"
                        placeholder={lang === 'en' ? "What are you working on?" : "بماذا تفكر؟"}
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={status === "sending"}
                      className="w-full rounded-2xl h-16 font-black uppercase tracking-[0.2em] text-sm group bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/25"
                    >
                      {status === "sending" ? (
                        <div className="flex items-center gap-3">
                            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            {t.contact.sending}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          {t.contact.send}
                          <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                      )}
                    </Button>

                    {status === "success" && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 p-5 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50 text-green-700 dark:text-green-400 rounded-2xl font-bold">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>{t.contact.success}</span>
                      </motion.div>
                    )}

                    {status === "error" && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 p-5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 text-red-700 dark:text-red-400 rounded-2xl font-bold">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{t.contact.error}</span>
                      </motion.div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="lg:col-span-5 space-y-10" variants={containerVariants} initial="hidden" animate="visible">
              <div className="space-y-4">
                <motion.h3 variants={itemVariants} className="text-3xl font-black tracking-tight">{contact.connectTitle}</motion.h3>
                <motion.p variants={itemVariants} className="text-lg text-muted-foreground leading-relaxed font-medium">
                  {contact.connectText}
                </motion.p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {contact.links.map((link) => (
                  <ContactMethod 
                    key={`${link.label}-${link.url}`}
                    label={link.label}
                    value={link.value}
                    url={link.url}
                    icon={link.icon}
                    variants={itemVariants}
                  />
                ))}
              </div>
              
              <motion.div variants={itemVariants} className="pt-6">
                 <div className="flex items-center gap-6 p-8 rounded-[2.5rem] bg-linear-to-br from-gray-900 to-gray-800 dark:from-blue-600 dark:to-purple-700 text-white shadow-2xl shadow-black/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors" />
                    <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                       <MapPin className="w-8 h-8" />
                    </div>
                    <div>
                       <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-1">{lang === 'en' ? 'Base of Operations' : 'المقر الرئيسي'}</div>
                       <div className="text-2xl font-black tracking-tight">{lang === 'en' ? 'Cairo, Egypt' : 'القاهرة، مصر'}</div>
                    </div>
                 </div>
              </motion.div>
            </motion.div>
          </div>

          {isAdminAuthenticated && (
            <AdminSectionWrapper title="Contact Page Management">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PageAdminEditor
                  title="Page Content"
                  description="Edit intro text, connection brief, and social links."
                  payload={JSON.stringify(contact, null, 2)}
                  intent="save-content-section"
                  section="contact"
                />
                <PageAdminEditor
                  title="Translations"
                  description="Edit form labels and localized status messages."
                  payload={JSON.stringify(
                    {
                      en: rootData.translations.en.contact,
                      ar: rootData.translations.ar.contact,
                    },
                    null,
                    2,
                  )}
                  intent="save-translation-section"
                  section="contact"
                />
              </div>
            </AdminSectionWrapper>
          )}
        </motion.div>
      </Section>
    </div>
  );
};
