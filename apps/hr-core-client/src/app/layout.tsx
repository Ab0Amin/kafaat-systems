import { type Metadata } from 'next';
import App from './app';
import { AuthProvider } from '../components/providers/AuthProvider';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import './global.css';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: 'owner App',
    description: 'This is my app description',
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}
export default async function RootLayout({ children, params: { locale } }: RootLayoutProps) {
  return (
    <html lang={locale}>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <App>{children}</App>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
