import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import "../styles/style.css";
import "../styles/responsive.css";
import "../styles/animations.css";
import "../styles/blog.css";
import "../styles/service-modal.css";
import "../styles/portfolio.css";
import "../styles/custom-modal.css";

const inter = Inter({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter" 
});
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins" 
});

export const metadata: Metadata = {
  title: "Adversity Media | Your Dream Designs Come to Life - Complete Digital Marketing Solutions",
  description: "Adversity Media: Leading digital marketing agency in Hyderabad offering SEO, web development, mobile apps, branding, and creative design solutions. Transform your business with our expert digital strategies.",
};

import Header from "../components/Header";
import Footer from "../components/Footer";
import AOSInit from "../components/AOSInit";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" rel="stylesheet" />
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${poppins.variable}`}>
        <Header />
        <AOSInit />
        {children}
        <Footer />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" strategy="lazyOnload" />
        <Script src="https://unpkg.com/aos@2.3.1/dist/aos.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.12/typed.min.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
