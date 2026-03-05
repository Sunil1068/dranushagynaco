import { Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Logo size={36} />
              <span className="text-xl font-bold text-[#874B61] tracking-tight">
                Dr. Anusha B
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              M.B.B.S., M.S. (OBG) | DMAS &amp; FMAS | Fellow in ART<br />
              Consultant Obstetrician &amp; Gynaecologist, Laparoscopic &amp; Infertility Specialist
              at Harshitha Multi-Speciality Hospital, Anantapur.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#874B61] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['About', 'Services', 'Credentials', 'Gallery', 'Testimonials', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={item === 'Gallery' ? '/gallery' : `/#${item === 'Credentials' ? 'experience' : item.toLowerCase()}`}
                    className="text-sm text-[#874B61] hover:text-[#6B3A4D] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#874B61] mb-4">
              Contact Info
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4 text-[#874B61]" />
                08554 243422
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 text-[#874B61] mt-0.5" />
                <span>Harshitha Multi-Speciality Hospital<br />#6-3-984, 1st Cross Road,<br />Maruthi Nagar, Anantapur,<br />Andhra Pradesh – 515002</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Dr. Anusha B. All rights reserved.
          </p>
                  </div>
      </div>
    </footer>
  );
}
