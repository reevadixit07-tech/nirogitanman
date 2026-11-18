import Link from 'next/link'
import { AiBrain01Icon, Calendar01Icon, ArrowRight01Icon, CheckmarkCircle01Icon } from 'hugeicons-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              N
            </div>
            <span className="font-bold text-xl tracking-tight">Nirogitanman</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#services" className="hover:text-emerald-600 transition">Services</a>
            <a href="#plans" className="hover:text-emerald-600 transition">Plans & Roles</a>
            <a href="#location" className="hover:text-emerald-600 transition">Wellness Center</a>
          </div>

          <Link
            href="/login"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            Login / Dashboard <ArrowRight01Icon size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <span className="inline-block px-3.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full mb-4">
          Holistic Health & AI Wellness Platform
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 max-w-3xl mx-auto leading-tight">
          Modern Healthcare Meets <span className="text-emerald-600">Ayurveda & AI</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto mt-5 text-base md:text-lg">
          Book verified doctor consultations, explore curated medicines, and generate personalized Indian diet charts powered by Gemini AI.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition flex items-center gap-2"
          >
            Get Started Free <ArrowRight01Icon size={18} />
          </Link>
          <a
            href="#services"
            className="px-7 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Everything You Need in One Portal</h2>
            <p className="text-gray-500 mt-2 text-sm">Built for patients, nutrition seekers, and certified doctors.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Calendar01Icon size={22} />
              </div>
              <h3 className="text-lg font-bold mb-2">Doctor Consultations</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Schedule appointments with Ayurveda specialists, general physicians, and clinical nutritionists with live prescription notes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <AiBrain01Icon size={22} />
              </div>
              <h3 className="text-lg font-bold mb-2">AI Diet Planner & Bot</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Chat with our 24/7 AI Health Bot for wellness queries or unlock custom Indian meal charts tailored to your health goals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <CheckmarkCircle01Icon size={22} />
              </div>
              <h3 className="text-lg font-bold mb-2">Verified Medicines</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Browse doctor-approved herbal and clinical formulations complete with dosage instructions and transparent INR pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role / Tier Comparison */}
      <section id="plans" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Choose Your Portal Access</h2>
          <p className="text-gray-500 mt-2 text-sm">Select your role during sign-up to test each dashboard experience.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="p-6 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-gray-400">Free User</span>
              <p className="text-3xl font-extrabold mt-2">₹0 <span className="text-sm font-normal text-gray-400">/ month</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckmarkCircle01Icon size={16} className="text-emerald-600" /> Book Doctor Consultations</li>
                <li className="flex items-center gap-2"><CheckmarkCircle01Icon size={16} className="text-emerald-600" /> Browse Medicines Directory</li>
                <li className="flex items-center gap-2"><CheckmarkCircle01Icon size={16} className="text-emerald-600" /> 24/7 AI Health Bot Access</li>
              </ul>
            </div>
            <Link href="/login" className="mt-8 block text-center py-2.5 border border-emerald-600 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition">
              Join as Free User
            </Link>
          </div>

          {/* Paid Tier */}
          <div className="p-6 rounded-2xl border-2 border-emerald-600 bg-emerald-50/30 flex flex-col justify-between relative">
            <div>
              <span className="text-xs font-bold uppercase text-emerald-600">Paid Member</span>
              <p className="text-3xl font-extrabold mt-2">₹499 <span className="text-sm font-normal text-gray-400">/ month</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckmarkCircle01Icon size={16} className="text-emerald-600" /> Everything in Free Tier</li>
                <li className="flex items-center gap-2"><CheckmarkCircle01Icon size={16} className="text-emerald-600" /> Unlimited AI Diet Planner</li>
                <li className="flex items-center gap-2"><CheckmarkCircle01Icon size={16} className="text-emerald-600" /> Priority Doctor Scheduling</li>
              </ul>
            </div>
            <Link href="/login" className="mt-8 block text-center py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition">
              Join as Paid User
            </Link>
          </div>

          {/* Doctor Portal */}
          <div className="p-6 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-gray-400">Practitioner</span>
              <p className="text-3xl font-extrabold mt-2">Doctor <span className="text-sm font-normal text-gray-400">Portal</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckmarkCircle01Icon size={16} className="text-emerald-600" /> Manage Patient Appointments</li>
                <li className="flex items-center gap-2"><CheckmarkCircle01Icon size={16} className="text-emerald-600" /> Add Prescriptions & Notes</li>
                <li className="flex items-center gap-2"><CheckmarkCircle01Icon size={16} className="text-emerald-600" /> Publish Verified Medicines</li>
              </ul>
            </div>
            <Link href="/login" className="mt-8 block text-center py-2.5 border border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition">
              Doctor Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Google Maps Location Section */}
      <section id="location" className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-3">Visit Our Wellness Center</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Prefer an in-person Ayurvedic or clinical checkup? Drop by our flagship center in New Delhi or book an online slot from your dashboard.
            </p>
            <p className="text-xs font-semibold text-gray-500">Mon – Sat: 9:00 AM – 7:00 PM IST</p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-64">
            <iframe
              title="Nirogitanman Wellness Center Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d77.06889754725782!3d28.52758200617607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-gray-400 border-t border-gray-100">
        © 2026 Nirogitanman Health & Wellness. Built with Next.js, Supabase & Gemini AI.
      </footer>
    </div>
  )
}