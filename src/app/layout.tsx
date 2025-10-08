import type {Metadata, Viewport} from 'next';
import './globals.css';
import PWAInstallButton from '@/components/PWAInstallButton';

export const metadata: Metadata = {
  applicationName: "AudioClear",
  title: {
    default: "AudioClear",
    template: `%s | AudioClear`,
  },
  description: "An app for hearing tests and voice denoising.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AudioClear",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <PWAInstallButton />
      </body>
    </html>
  );
}
