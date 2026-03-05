import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Dr. Anusha B | Consultant Obstetrician & Gynaecologist | Anantapur',
  description: 'Dr. Anusha B – M.B.B.S., M.S. (OBG), DMAS & FMAS, Fellow in ART. Laparoscopic & Infertility Specialist at Harshitha Multi-Speciality Hospital, Anantapur.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
