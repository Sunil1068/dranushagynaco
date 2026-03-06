'use client';

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Heart, Baby, Stethoscope, Shield, Clock, Award,
  Star, Phone, MapPin, ChevronRight, CheckCircle,
  Calendar, GraduationCap, Building2, Scissors, Microscope,
  Activity, Eye, Syringe,
  BookOpen, Target, Lightbulb, HeartHandshake
} from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: Baby,
    title: 'Normal & Caesarean Deliveries',
    desc: 'Expert care for both normal vaginal deliveries and caesarean sections with focus on mother and baby safety.',
  },
  {
    icon: Shield,
    title: 'High-Risk Pregnancy',
    desc: 'Specialized monitoring and advanced management for complicated and high-risk pregnancies.',
  },
  {
    icon: Scissors,
    title: 'Laparoscopic Surgeries',
    desc: 'Minimally invasive gynaecological surgeries for faster recovery and reduced complications.',
  },
  {
    icon: Microscope,
    title: 'Infertility Treatment',
    desc: 'Comprehensive infertility evaluation and treatment including IUI and assisted reproductive techniques.',
  },
  {
    icon: Heart,
    title: 'PCOS & Hormonal Disorders',
    desc: 'Personalized treatment plans for Polycystic Ovary Syndrome and hormonal imbalances.',
  },
  {
    icon: Clock,
    title: 'Menstrual Disorders',
    desc: 'Expert evaluation and management of irregular periods, heavy bleeding, and related conditions.',
  },
  {
    icon: Activity,
    title: 'Hysterectomy',
    desc: 'Open and laparoscopic hysterectomy procedures with comprehensive pre and post-operative care.',
  },
  {
    icon: Stethoscope,
    title: 'Antenatal & Postnatal Care',
    desc: 'Complete pregnancy care from conception through delivery and postpartum recovery.',
  },
  {
    icon: Award,
    title: 'Assisted Reproductive Techniques',
    desc: 'Advanced ART procedures and fertility support with compassionate, evidence-based treatment.',
  },
];

const specialTraining = [
  { icon: Syringe, title: 'Advanced Instrument Handling', desc: 'Surgical Instrument Dealings' },
  { icon: Baby, title: 'IUI Procedures', desc: 'Intrauterine Insemination' },
  { icon: Eye, title: 'Colposcopy', desc: 'Cervical Screening Procedures' },
  { icon: Microscope, title: 'Hysteroscopy', desc: 'Diagnostic & Operative' },
  { icon: Shield, title: 'High-Risk Pregnancy', desc: 'Management Training' },
];

const procedures = [
  'Female Sterilization – Open & Laparoscopic',
  'Postpartum & Interval Tubectomy',
  'Ectopic Pregnancy – Medical Management',
  'Ectopic Pregnancy – Laparoscopic & Open Surgical',
  'Emergency Obstetric & Gynaecological Care',
];

const testimonials = [
  {
    name: 'Lakshmi D.',
    condition: 'High-Risk Pregnancy',
    text: 'Dr. Anusha was with us through every step of our high-risk pregnancy. Her expertise and calm demeanor gave us the confidence we needed. Both baby and I are healthy thanks to her!',
    rating: 5,
  },
  {
    name: 'Priyanka M.',
    condition: 'Infertility Treatment',
    text: 'After years of trying, Dr. Anusha helped us conceive. Her thorough approach and compassionate care made all the difference. We are forever grateful.',
    rating: 5,
  },
  {
    name: 'Swathi R.',
    condition: 'PCOS Management',
    text: 'Dr. Anusha\'s treatment plan for my PCOS was life-changing. She explained everything clearly and the results were visible within months. Highly recommend!',
    rating: 5,
  },
];

const credentials = [
  { icon: GraduationCap, label: 'M.B.B.S.', sub: 'Bachelor of Medicine & Surgery' },
  { icon: Award, label: 'M.S. (OBG)', sub: 'Master of Surgery – Obstetrics & Gynaecology' },
  { icon: Scissors, label: 'DMAS & FMAS', sub: 'Diploma & Fellowship in Minimal Access Surgery' },
  { icon: Baby, label: 'Fellowship in ART', sub: 'Assisted Reproductive Technology' },
  { icon: Building2, label: 'AMC Reg. No: 123387', sub: 'Andhra Medical Council' },
  { icon: Calendar, label: 'Consultant OBG', sub: 'Harshitha Multi-Speciality Hospital' },
];

const visionItems = [
  { icon: HeartHandshake, text: 'Promoting safe motherhood and evidence-based obstetric care' },
  { icon: Shield, text: 'Strengthening high-risk pregnancy management with advanced monitoring' },
  { icon: Target, text: 'Advancing minimally invasive surgery for faster recovery' },
  { icon: Lightbulb, text: 'Providing ethical and transparent infertility treatment' },
  { icon: BookOpen, text: 'Empowering women through awareness and reproductive health education' },
  { icon: Heart, text: 'Ensuring compassionate, patient-centered care at every stage' },
];

export default function HomePage() {

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#874B61]/10 via-white to-[#874B61]/5" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#874B61]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#874B61]/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-[#874B61]/10 text-[#874B61] px-4 py-2 rounded-full text-sm font-medium mb-6">
                Consultant Obstetrician &amp; Gynaecologist
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#874B61] leading-tight mb-4">
                Dr. Anusha B
              </h1>
              <p className="text-base md:text-lg text-[#874B61] font-medium mb-2">
                M.B.B.S., M.S. (OBG) | DMAS &amp; FMAS | Fellow in ART
              </p>
              <p className="text-sm text-gray-500 mb-6">Reg. No: AMC 123387</p>

              {/* Mobile Portrait (Visible only on mobile) */}
              <div className="md:hidden mb-8">
                <div className="relative w-full aspect-[1/1.2] mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[#FDF8F0] bg-[#F6EEDE]">
                  <Image
                    src="/images/profile-1.jpeg"
                    alt="Dr. Anusha B"
                    fill
                    className="object-cover object-top scale-[1.05]"
                    priority
                    quality={100}
                    sizes="100vw"
                  />
                  <div className="absolute bottom-4 left-4 bg-[#874B61] text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-white/20">
                    <Stethoscope className="h-4 w-4" />
                    <p className="text-xs font-bold tracking-wide uppercase">OBG Specialist</p>
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Laparoscopic &amp; Infertility Specialist providing compassionate,
                evidence-based women&apos;s healthcare at Harshitha Multi-Speciality Hospital, Anantapur.
              </p>
              <div className="flex flex-row gap-3 md:gap-4 mt-2">
                <a href="#contact" className="btn-primary !px-4 md:!px-8 !py-2.5 md:!py-3 !text-sm md:!text-base !rounded-full flex items-center justify-center gap-2 whitespace-nowrap">
                  Book Now
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                </a>
                <a href="#services" className="btn-secondary !px-4 md:!px-8 !py-2.5 md:!py-3 !text-sm md:!text-base !rounded-full whitespace-nowrap">
                  Services
                </a>
              </div>
              <div className="grid grid-cols-3 gap-2 md:gap-4 mt-10 pt-8 border-t border-[#874B61]/20 text-center md:text-left">
                <div>
                  <p className="text-xl sm:text-3xl font-bold text-[#874B61]">1000+</p>
                  <p className="text-[10px] sm:text-sm text-gray-500">Patients Treated</p>
                </div>
                <div>
                  <p className="text-xl sm:text-3xl font-bold text-[#874B61]">500+</p>
                  <p className="text-[10px] sm:text-sm text-gray-500">Deliveries</p>
                </div>
                <div>
                  <p className="text-xl sm:text-3xl font-bold text-[#874B61]">100%</p>
                  <p className="text-[10px] sm:text-sm text-gray-500">Dedication</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center justify-center w-full">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-br from-[#874B61]/20 to-[#874B61]/40 rounded-[2rem] blur-lg opacity-30" />
                  <div className="relative w-80 h-[28rem] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#F6EEDE] bg-purple-50">
                    <Image
                      src="/images/profile-1.jpeg"
                      alt="Dr. Anusha B"
                      fill
                      className="object-cover object-center scale-[1.02]"
                      priority
                      quality={100}
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-[#874B61] text-white p-4 rounded-2xl shadow-lg">
                    <Stethoscope className="h-6 w-6 mb-1" />
                    <p className="text-xs font-medium">OBG Specialist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 md:py-20 bg-[#F6EEDE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="absolute top-1/2 -right-5 w-12 h-12 bg-[#874B61]/15 rounded-full" />
              <div className="absolute -bottom-6 left-16 w-28 h-28 bg-[#874B61]/12 rounded-full" />

              <div className="relative h-[420px] sm:h-[520px] rounded-[2.5rem] overflow-hidden border border-[#874B61]/20 shadow-2xl bg-white">
                <Image
                  src="/images/profile-2.jpg"
                  alt="Dr. Anusha B"
                  fill
                  className="object-cover scale-[1.02]"
                  style={{ objectPosition: 'center 45%' }}
                  quality={100}
                  sizes="(max-width: 1024px) 100vw, 700px"
                />
              </div>
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#874B61] mb-6 leading-tight">
                About <span style={{ color: '#874B61' }}>Dr. Anusha B</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Dr. Anusha B is a distinguished Obstetrician &amp; Gynaecologist with comprehensive experience in women&apos;s health. With strong academic credentials and advanced laparoscopic and reproductive training, she offers evidence-based, compassionate care tailored to every patient.
              </p>

              <h3 className="text-2xl font-bold text-[#874B61] mb-4">Areas of Expertise</h3>
              <div className="space-y-3 mb-8">
                {[
                  'Obstetrics',
                  'Infertility',
                  'Gynaecology',
                  'Laparoscopic Surgeries',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-lg text-[#2F2A4E]">
                    <CheckCircle className="h-5 w-5 text-[#874B61]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <a
                href="#experience"
                className="inline-flex items-center gap-2 bg-[#F6EEDE] border-2 border-[#874B61]/35 text-[#874B61] hover:bg-[#874B61]/10 font-semibold px-8 py-3 rounded-2xl transition-all"
              >
                Know More About Doctor
                <ChevronRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Credentials */}
      <section id="experience" className="py-20 bg-gradient-to-br from-[#874B61]/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title text-[#874B61]">Education &amp; <span className="text-[#874B61]">Credentials</span></h2>
          <p className="section-subtitle">
            Strong academic foundation with advanced surgical and reproductive training
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {credentials.map((cred) => (
              <div key={cred.label} className="card flex items-start gap-4 text-left hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#874B61]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <cred.icon className="h-6 w-6 text-[#874B61]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{cred.label}</h4>
                  <p className="text-sm text-gray-500">{cred.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Training */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="section-title text-[#874B61]">Special <span className="text-[#874B61]">Training</span></h2>
            <p className="section-subtitle">Advanced clinical skills and specialized fellowship programs</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {specialTraining.map((item) => (
              <div key={item.title} className="text-center group">
                <div className="w-16 h-16 bg-[#874B61]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#874B61] transition-colors">
                  <item.icon className="h-8 w-8 text-[#874B61] group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Procedures */}
          <div className="mt-28 max-w-[900px] mx-auto">
            <h3 className="text-2xl md:text-[32px] font-semibold text-center text-[#874B61] mb-10">
              Reproductive &amp; Emergency Procedures
            </h3>
            <div className="space-y-4">
              {procedures.map((proc) => (
                <div
                  key={proc}
                  className="flex items-center gap-4 bg-[#874B61]/10 p-[18px] md:p-[22px] rounded-xl shadow-sm hover:shadow-md hover:bg-[#874B61]/15 hover:-translate-y-[3px] transition-all duration-200 ease-out"
                >
                  <div className="w-8 h-8 bg-[#874B61] rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-[16px] md:text-[18px] font-medium text-gray-800 leading-relaxed">
                    {proc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 md:py-20 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#874B61] mb-4">
              Areas of <span className="text-[#874B61]">Expertise</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive women&apos;s healthcare services with advanced medical expertise
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {services.map((service, idx) => (
              <div
                key={service.title}
                className={`bg-[#FDF8F0] border border-[#874B61]/10 rounded-2xl p-4 md:p-6 hover:shadow-xl transition-all duration-300 group text-left ${service.title === 'Assisted Reproductive Techniques' ? 'hidden md:block' : ''}`}
              >
                <div className="w-10 h-10 md:w-16 md:h-16 bg-[#874B61]/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-[#874B61] transition-colors">
                  <service.icon className="h-5 w-5 md:h-8 md:w-8 text-[#874B61] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{service.title}</h3>
                <p className="text-[11px] md:text-base text-gray-600 leading-relaxed line-clamp-3 md:line-clamp-none">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Vision */}
      <section className="py-12 md:py-20 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-t border-[#874B61]/10 pt-16">
          <h2 className="section-title text-[#874B61]">Leadership &amp; <span className="text-[#874B61]">Vision</span></h2>
          <p className="section-subtitle">
            Committed to advancing women&apos;s healthcare through expertise and compassion
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visionItems.map((item) => (
              <div key={item.text} className="card flex items-start gap-4 text-left hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 bg-[#874B61]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-[#874B61]" />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-20 bg-[#FDF8F0]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#874B61] mb-6">
              Get in <span className="text-[#874B61]">Touch</span>
            </h2>
            <div className="w-20 h-1.5 bg-[#874B61] mx-auto rounded-full mb-6 opacity-30" />
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Visit our hospital or call to book an appointment
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Phone Card */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(135,75,97,0.05)] border border-[#874B61]/5 hover:border-[#874B61]/20 hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-[#FDF8F0] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#874B61] transition-all duration-300">
                <Phone className="h-8 w-8 text-[#874B61] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Phone</h3>
              <a href="tel:08554243422" className="text-[#874B61] text-2xl font-bold hover:text-[#6B3A4D] transition-colors block mb-2">
                08554 243422
              </a>
              <p className="text-gray-500 font-medium">Available during clinic hours for appointments</p>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(135,75,97,0.05)] border border-[#874B61]/5 hover:border-[#874B61]/20 hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-[#FDF8F0] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#874B61] transition-all duration-300">
                <MapPin className="h-8 w-8 text-[#874B61] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Location</h3>
              <div className="space-y-2">
                <p className="text-[#874B61] font-bold text-lg">Harshitha Multi-Speciality Hospital</p>
                <p className="text-gray-500 leading-relaxed font-medium">
                  #6-3-984, 1st Cross Road, Maruthi Nagar, Anantapur, AP – 515002
                </p>
              </div>
            </div>

            {/* Visiting Hours Card */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(135,75,97,0.05)] border border-[#874B61]/5 hover:border-[#874B61]/20 hover:-translate-y-2 transition-all duration-300 group lg:col-span-1">
              <div className="w-16 h-16 bg-[#FDF8F0] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#874B61] transition-all duration-300">
                <Clock className="h-8 w-8 text-[#874B61] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Clinic Hours</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                  <span className="text-gray-600 font-medium text-sm md:text-base">Mornings</span>
                  <span className="text-[#874B61] font-bold text-sm md:text-base bg-[#FDF8F0] px-3 py-1 rounded-lg">9:00 AM – 1:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium text-sm md:text-base">Evenings</span>
                  <span className="text-[#874B61] font-bold text-sm md:text-base bg-[#FDF8F0] px-3 py-1 rounded-lg">5:00 PM – 9:00 PM</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-[#874B61]">
                  <Activity className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">24/7 Emergency Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
