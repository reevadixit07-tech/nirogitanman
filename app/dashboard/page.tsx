'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { 
  AiBrain01Icon, 
  Logout01Icon, 
  Calendar01Icon,
  CheckmarkCircle01Icon
} from 'hugeicons-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [medicines, setMedicines] = useState<any[]>([])
  const [consultations, setConsultations] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('overview')

  // Book Consultation Form (Patients)
  const [doctorName, setDoctorName] = useState('Dr. Aarav Sharma (Ayurveda & Wellness)')
  const [scheduledDate, setScheduledDate] = useState('')
  const [symptoms, setSymptoms] = useState('')

  // Add Medicine Form (Doctors)
  const [medName, setMedName] = useState('')
  const [medCategory, setMedCategory] = useState('Immunity')
  const [medDosage, setMedDosage] = useState('')
  const [medDesc, setMedDesc] = useState('')
  const [medPrice, setMedPrice] = useState('')

  // AI Diet Planner & Health Bot state
  const [goal, setGoal] = useState('')
  const [dietType, setDietType] = useState('Vegetarian')
  const [dietResult, setDietResult] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([
    { role: 'bot', text: 'Namaste! I am the Nirogitanman AI Health Bot. Ask me any wellness, lifestyle, or general health question.' }
  ])
  const [aiLoading, setAiLoading] = useState(false)

  const router = useRouter()

  const fetchData = async (userId: string) => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (profileData) setProfile(profileData)

    const { data: medData } = await supabase.from('medicines').select('*').order('created_at', { ascending: false })
    if (medData) setMedicines(medData)

    const { data: consData } = await supabase.from('consultations').select('*').order('created_at', { ascending: false })
    if (consData) setConsultations(consData)
  }

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
      await fetchData(session.user.id)
      setLoading(false)
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Patient books a consultation
  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const { error } = await supabase.from('consultations').insert({
      patient_id: user.id,
      patient_name: profile?.full_name || user.email,
      doctor_name: doctorName,
      scheduled_date: scheduledDate,
      symptoms,
      status: 'pending'
    })

    if (error) {
      alert('Error booking: ' + error.message)
    } else {
      alert('Consultation booked!')
      setScheduledDate('')
      setSymptoms('')
      fetchData(user.id)
    }
  }

  // Doctor updates consultation status & notes
  const handleUpdateConsultation = async (id: string, newStatus: string) => {
    const notes = prompt('Enter prescription or doctor notes for the patient:') || 'Reviewed by doctor.'
    const { error } = await supabase
      .from('consultations')
      .update({ status: newStatus, doctor_notes: notes })
      .eq('id', id)

    if (!error && user) fetchData(user.id)
  }

  // Doctor adds a new medicine
  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('medicines').insert({
      name: medName,
      category: medCategory,
      dosage: medDosage,
      description: medDesc,
      price: Number(medPrice) || 0
    })

    if (error) {
      alert('Error adding medicine: ' + error.message)
    } else {
      alert('Medicine added to directory!')
      setMedName('')
      setMedDosage('')
      setMedDesc('')
      setMedPrice('')
      if (user) fetchData(user.id)
    }
  }

  // AI Diet Planner (calls /api/ai)
  const generateDietPlan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (profile?.role === 'free_user') {
      alert('AI Diet Planner is a Paid User feature. Switch role or upgrade to unlock!')
      return
    }
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'diet',
          prompt: `Create a concise 1-day Indian ${dietType} diet plan (Breakfast, Lunch, Evening Snack, Dinner) for this health goal: ${goal}`
        })
      })
      const data = await res.json()
      setDietResult(data.reply || 'Could not generate plan.')
    } catch {
      setDietResult('Error connecting to AI service.')
    }
    setAiLoading(false)
  }

  // AI Health Bot (calls /api/ai)
  const handleBotChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMsg = chatInput
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }])
    setChatInput('')
    setAiLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bot', prompt: userMsg })
      })
      const data = await res.json()
      setChatMessages((prev) => [...prev, { role: 'bot', text: data.reply || 'No response.' }])
    } catch {
      setChatMessages((prev) => [...prev, { role: 'bot', text: 'Error reaching AI Bot.' }])
    }
    setAiLoading(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">Loading your portal...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">N</div>
            <span className="font-bold text-gray-900 text-lg">Nirogitanman</span>
          </div>

          <div className="space-y-1">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'overview' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <CheckmarkCircle01Icon size={18} /> Overview
            </button>
            <button onClick={() => setActiveTab('consultations')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'consultations' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Calendar01Icon size={18} /> Consultations
            </button>
            <button onClick={() => setActiveTab('medicines')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'medicines' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              Medicines
            </button>
            <button onClick={() => setActiveTab('ai')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'ai' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <AiBrain01Icon size={18} /> AI Diet & Bot
            </button>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition">
          <Logout01Icon size={18} /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {profile?.full_name || user?.email}</h1>
            <p className="text-sm text-gray-400 capitalize">
              Role: <span className="font-semibold text-emerald-600">{profile?.role?.replace('_', ' ')}</span>
            </p>
          </div>
          <button onClick={handleLogout} className="md:hidden p-2 text-red-600 bg-red-50 rounded-xl"><Logout01Icon size={20} /></button>
        </header>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account Tier</span>
              <p className="text-xl font-bold text-gray-900 mt-2 capitalize">{profile?.role?.replace('_', ' ')}</p>
              {profile?.role === 'free_user' && (
                <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded-lg">Free Plan: AI Bot included. Paid Plan unlocks AI Diet Planner.</p>
              )}
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Consultations</span>
              <p className="text-xl font-bold text-gray-900 mt-2">{consultations.length} Total</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Medicines Directory</span>
              <p className="text-xl font-bold text-gray-900 mt-2">{medicines.length} Items</p>
            </div>
          </div>
        )}

        {/* Tab 2: Consultations */}
        {activeTab === 'consultations' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {profile?.role !== 'doctor' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-fit">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Book a Doctor</h2>
                <form onSubmit={handleBookConsultation} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Select Doctor</label>
                    <select value={doctorName} onChange={(e) => setDoctorName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-gray-800 bg-white">
                      <option>Dr. Aarav Sharma (Ayurveda & Wellness)</option>
                      <option>Dr. Priya Verma (General Physician)</option>
                      <option>Dr. Rohan Mehta (Clinical Nutritionist)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Preferred Date</label>
                    <input type="date" required value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Symptoms / Reason</label>
                    <textarea required rows={3} value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Describe your concern..." className="w-full px-3 py-2 border rounded-lg text-gray-800" />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition">
                    Book Consultation
                  </button>
                </form>
              </div>
            )}

            <div className={`${profile?.role === 'doctor' ? 'lg:col-span-3' : 'lg:col-span-2'} bg-white rounded-2xl border border-gray-100 p-6 shadow-sm`}>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {profile?.role === 'doctor' ? 'Patient Appointments Queue' : 'Your Consultations'}
              </h2>
              {consultations.length === 0 ? (
                <p className="text-sm text-gray-500">No consultations found.</p>
              ) : (
                <div className="space-y-3">
                  {consultations.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <p className="font-bold text-gray-900">{c.doctor_name}</p>
                        <p className="text-xs text-gray-500">Patient: {c.patient_name} | Date: {c.scheduled_date}</p>
                        {c.symptoms && <p className="text-xs text-gray-600 mt-1">Symptoms: {c.symptoms}</p>}
                        {c.doctor_notes && <p className="text-xs text-emerald-700 mt-1 font-medium">Doctor Notes: {c.doctor_notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full capitalize">{c.status}</span>
                        {profile?.role === 'doctor' && c.status !== 'completed' && (
                          <button
                            onClick={() => handleUpdateConsultation(c.id, 'completed')}
                            className="px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800"
                          >
                            Complete & Add Notes
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Medicines */}
        {activeTab === 'medicines' && (
          <div className="space-y-6">
            {profile?.role === 'doctor' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Medicine (Doctor Portal)</h2>
                <form onSubmit={handleAddMedicine} className="grid md:grid-cols-4 gap-4">
                  <input required placeholder="Medicine Name" value={medName} onChange={(e) => setMedName(e.target.value)} className="px-3 py-2 border rounded-lg text-gray-800" />
                  <input required placeholder="Dosage (e.g. 1 tab twice daily)" value={medDosage} onChange={(e) => setMedDosage(e.target.value)} className="px-3 py-2 border rounded-lg text-gray-800" />
                  <input required type="number" placeholder="Price (₹)" value={medPrice} onChange={(e) => setMedPrice(e.target.value)} className="px-3 py-2 border rounded-lg text-gray-800" />
                  <button type="submit" className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition">
                    + Add Medicine
                  </button>
                  <input required placeholder="Short description & benefits..." value={medDesc} onChange={(e) => setMedDesc(e.target.value)} className="md:col-span-4 px-3 py-2 border rounded-lg text-gray-800" />
                </form>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Verified Medicines Directory</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {medicines.map((m) => (
                  <div key={m.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{m.name}</h3>
                      <span className="text-emerald-600 font-semibold text-sm">₹{m.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{m.description}</p>
                    <p className="text-xs font-medium text-gray-600">Dosage: {m.dosage}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: AI Diet Planner & Health Bot */}
        {activeTab === 'ai' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Diet Planner */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <AiBrain01Icon size={20} className="text-emerald-600" /> AI Diet Planner
              </h2>
              <p className="text-sm text-gray-500 mb-4">Custom Indian diet charts powered by AI.</p>

              {profile?.role === 'free_user' && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                  Locked on Free Tier. Sign up as a Paid User (or update your role in Supabase) to test!
                </div>
              )}

              <form onSubmit={generateDietPlan} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Health Goal</label>
                  <input required value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Weight loss & gut health" className="w-full px-4 py-2 border rounded-lg text-gray-800" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Diet Preference</label>
                  <select value={dietType} onChange={(e) => setDietType(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-gray-800 bg-white">
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Ayurvedic Sattvic">Ayurvedic Sattvic</option>
                  </select>
                </div>
                <button type="submit" disabled={aiLoading} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition">
                  {aiLoading ? 'Generating...' : 'Generate Diet Plan'}
                </button>
              </form>

              {dietResult && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-950 text-sm whitespace-pre-line">
                  {dietResult}
                </div>
              )}
            </div>

            {/* AI Health Bot */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-[500px]">
              <h2 className="text-lg font-bold text-gray-900 mb-2">AI Health Bot</h2>
              <p className="text-sm text-gray-500 mb-4">Ask wellness, sleep, or nutrition questions.</p>

              <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-gray-50 rounded-xl mb-4">
                {chatMessages.map((m, idx) => (
                  <div key={idx} className={`p-3 rounded-xl text-sm max-w-[85%] ${m.role === 'user' ? 'bg-emerald-600 text-white ml-auto' : 'bg-white border border-gray-200 text-gray-800'}`}>
                    {m.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleBotChat} className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a health question..."
                  className="flex-1 px-4 py-2 border rounded-lg text-gray-800"
                />
                <button type="submit" disabled={aiLoading} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition">
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}