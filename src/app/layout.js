import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Weather Intelligence | Real-Time Meteorological Insights",
  description: "Advanced weather data visualization developed for the PM Accelerator AI Intern Assessment by Joanna Zhang.",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-900 text-white transition-colors duration-500">        
        {/* Main Content Area */}
        {/* pb-20 ensures the content never overlaps with the footer on small screens */}
        <main className="flex-grow pb-20">
          {children}
        </main>

        {/* PM Accelerator Informational Footer */}
        <footer className="w-full py-12 px-6 bg-white/80 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-bold text-xl tracking-tight text-slate-800">
              Developed by <span className="text-blue-600">Joanna Zhang</span>
            </h2>
            
            <div className="mt-6 text-sm text-slate-600 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-blue-200"></span>
                <p className="font-bold uppercase tracking-[0.2em] text-[10px] text-blue-600">
                  About PM Accelerator
                </p>
                <span className="h-px w-8 bg-blue-200"></span>
              </div>

              <p className="max-w-2xl mx-auto italic leading-relaxed text-slate-500">
                "The Product Manager Accelerator program is designed to support PDMs and PMMs 
                in landing their dream roles at top-tier tech companies. It focuses on end-to-end 
                skill-building, from technical fluency to strategic leadership."
              </p>
              
              <div className="pt-2">
                <a 
                  href="https://www.linkedin.com/in/drnancyli/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-all duration-200 group"
                >
                  <span>Connect with PM Accelerator on LinkedIn</span>
                  <svg 
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
