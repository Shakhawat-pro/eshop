import './global.css';
import { Poppins, Roboto } from "next/font/google";
import MainLayout from './(mainLayout)/MainLayout';

export const metadata = {
  title: 'E-shop',
  description: 'Your one-stop shop for all things e-commerce.',
};

const roboto = Roboto({
  subsets: ['latin'],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: '--font-roboto',
});
const poppins = Poppins({
  subsets: ['latin'],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: '--font-poppins',
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${poppins.variable}`}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  )
}
