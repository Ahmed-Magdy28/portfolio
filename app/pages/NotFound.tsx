import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { Section } from '../components/Section';
import { useTranslation } from '../i18n/useTranslation';

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Section className="min-h-[calc(100vh-4rem)] flex items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        <div className="text-9xl mb-8">404</div>
        <h1 className="text-4xl md:text-5xl mb-4">{t.common.notFound}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button to="/" variant="primary" size="lg">
          {t.common.backHome}
        </Button>
      </motion.div>
    </Section>
  );
};
