import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:px-8">
        {children}
      </main>
      <footer className="border-t border-border py-8 text-center">
        <p className="text-muted text-sm">{t('footer.copyright')}</p>
        <p className="mt-2 text-xs text-muted max-w-xl mx-auto px-4">{t('footer.disclaimer')}</p>
      </footer>
    </div>
  );
}
