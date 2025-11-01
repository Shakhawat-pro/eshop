import './global.css';
import { Poppins } from "next/font/google";
import Providers from './providers';

export const metadata = {
  title: 'E-shop Seller',
  description: 'Manage your products and orders efficiently.',
}
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
      <body className={` font-sans antialiased  font-poppins ${poppins.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
