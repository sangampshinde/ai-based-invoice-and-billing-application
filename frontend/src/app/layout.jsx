import "@/index.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Invoicer — AI Invoicing & Financial Billing Agent",
  description:
    "AI-powered invoicing, billing, automated payment reminders, and autonomous financial copilot for modern businesses.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-bg text-ink antialiased selection:bg-accent/20 selection:text-accent-strong">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
