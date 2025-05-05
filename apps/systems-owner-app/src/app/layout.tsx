import { type Metadata } from 'next';
import App from './app';


// Import your global CSS

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
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
       <App>{children}</App>
      </body>
    </html>
  );
}
