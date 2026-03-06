'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Menu, X, LogOut, User, Activity } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, role, name, logout } = useAuth();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#about', label: 'About' },
    { href: '/#services', label: 'Services' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/testimonials', label: 'Testimonials' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-[#F6EEDE]/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 md:-ml-16">
            <Logo size={44} />
            <span className="text-xl font-semibold text-[#874B61]">
              Dr. Anusha B
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base font-medium text-[#6B3A4D] hover:text-[#874B61] transition-colors"
              >
                {link.label}
              </a>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {role === 'doctor' ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 bg-[#874B61] text-[#F6EEDE] hover:bg-[#874B61]/90 font-semibold px-5 py-2 rounded-2xl transition-all text-sm"
                  >
                    <Activity className="h-4 w-4" />
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/patient"
                    className="inline-flex items-center gap-2 bg-[#874B61] text-[#F6EEDE] hover:bg-[#874B61]/90 font-semibold px-5 py-2 rounded-2xl transition-all text-sm"
                  >
                    <User className="h-4 w-4" />
                    {name || 'My Account'}
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 bg-[#874B61] text-[#F6EEDE] hover:bg-[#874B61]/90 font-semibold px-5 py-2 rounded-2xl transition-all text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-secondary !py-2 !px-5 text-sm">
                  Patient Login
                </Link>
                <Link href="/doctor-login" className="btn-primary !py-2 !px-5 text-sm">
                  Doctor Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-[#874B61]/10 bg-[#F6EEDE] animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-1 py-6 px-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-lg font-medium text-[#6B3A4D] hover:text-[#874B61] hover:bg-[#874B61]/5 rounded-xl transition-all"
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px bg-[#874B61]/10 my-4" />
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  {role === 'doctor' ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 text-lg font-semibold text-[#874B61] hover:bg-[#874B61]/5 rounded-xl flex items-center gap-3"
                    >
                      <Activity className="h-5 w-5" />
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/patient"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 text-lg font-semibold text-[#874B61] hover:bg-[#874B61]/5 rounded-xl flex items-center gap-3"
                    >
                      <User className="h-5 w-5" />
                      My Account
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="px-4 py-3 text-lg font-semibold text-left text-[#874B61] hover:bg-[#874B61]/5 rounded-xl flex items-center gap-3"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  <Link href="/login" className="btn-secondary text-center text-sm !py-3 !rounded-xl">
                    Patient Login
                  </Link>
                  <Link href="/doctor-login" className="btn-primary text-center text-sm !py-3 !rounded-xl">
                    Doctor Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
