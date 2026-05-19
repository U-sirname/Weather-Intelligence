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
  title: "Weather Intelligence | AI Intern Assessment",
  description: "Real-time weather insights developed for PM Accelerator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        
        {/* Main Application Area */}
        <main className="flex-grow">
          {children}
        </main>

        {/* PM Accelerator Informational Footer */}
        <footer className="w-full py-10 px-6 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-bold text-lg text-slate-800">Developed by Joanna Zhang</h2>
            <div className="mt-4 text-sm text-slate-600 space-y-2">
              <p className="font-semibold uppercase tracking-widest text-xs text-blue-600">About PM 
Accelerator</p>
              <p className="max-w-2xl mx-auto italic">
                "The Product Manager Accelerator program is designed to support PDMs and PMMs in 
landing 
                their dream roles at top-tier tech companies. It focuses on end-to-end 
skill-building, 
                from technical fluency to strategic leadership."
              </p>
              <div className="pt-4">
                <a 
                  href="https://www.linkedin.com/company/product-manager-accelerator/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 font-medium transition"
                >
                  View Product Manager Accelerator on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
