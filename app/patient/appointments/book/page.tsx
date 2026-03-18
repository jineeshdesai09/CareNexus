"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, Clock, Stethoscope, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { getAvailableSpecializations, getDoctorsBySpecialization, bookAppointment } from "@/app/actions/patient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookAppointmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getAvailableSpecializations()
      .then(specs => {
        setSpecializations(specs);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load specializations.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedSpecialization) {
      setLoading(true);
      getDoctorsBySpecialization(selectedSpecialization)
        .then(docs => {
          setDoctors(docs);
          setLoading(false);
        })
        .catch(err => {
          setError("Failed to load doctors.");
          setLoading(false);
        });
    }
  }, [selectedSpecialization]);

  const handleSpecializationSelect = (spec: string) => {
    setSelectedSpecialization(spec);
    setStep(2);
  };

  const handleDoctorSelect = (doc: any) => {
    setSelectedDoctor(doc);
    setStep(3);
  };

  const handleBook = async () => {
    if (!selectedDoctor || !selectedDate) return;
    setBooking(true);
    setError("");

    try {
      // Force local date string extraction (YYYY-MM-DD) to prevent timezone drift
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      await bookAppointment(selectedDoctor.DoctorID, dateString, reason);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to book appointment. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  const getAvailableDays = () => {
    if (!selectedDoctor) return [];
    return selectedDoctor.Availabilities.map((a: any) => a.DayOfWeek);
  };

  const isDayAvailable = (date: Date) => {
    const day = date.getDay();
    const availableDays = getAvailableDays();
    // Compare date-only (not time) so today is allowed
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return availableDays.includes(day) && date >= today;
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white p-12 rounded-3xl shadow-lg border border-slate-100 text-center">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Appointment Confirmed!</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Your appointment with Dr. {selectedDoctor?.FirstName} {selectedDoctor?.LastName} on {selectedDate?.toLocaleDateString()} has been successfully securely booked.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/patient/dashboard")}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push("/patient/appointments")}
              className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              View My Appointments
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Book an Appointment</h1>
        <p className="text-slate-500">Schedule a visit with our specialists</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="flex gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`flex-1 h-2 rounded-full transition-colors duration-500 ${
              s <= step ? "bg-blue-600" : "bg-slate-200"
            }`} 
          />
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Stethoscope className="text-blue-500" />
            1. Select Speciality
          </h2>
          
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading specialities...</div>
          ) : specializations.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl">
              No doctors are currently available for booking.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {specializations.map((spec) => (
                <button
                  key={spec}
                  onClick={() => handleSpecializationSelect(spec)}
                  className="p-6 text-left border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <p className="font-bold text-slate-900 group-hover:text-blue-700">{spec}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in slide-in-from-right-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-500 bg-blue-50 p-2 rounded-xl"><Stethoscope className="w-5 h-5" /></span>
              2. Select Doctor
            </h2>
            <button 
              onClick={() => setStep(1)}
              className="text-sm font-bold text-slate-500 hover:text-slate-900"
            >
              Back to Specialities
            </button>
          </div>
          
          <p className="text-sm text-slate-500 mb-6 font-bold uppercase tracking-wider">
            Showing specificists for <span className="text-blue-600">{selectedSpecialization}</span>
          </p>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading doctors...</div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl">
              No doctors found for this speciality.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doc) => (
                <div
                  key={doc.DoctorID}
                  className="p-6 border-2 border-slate-100 rounded-2xl hover:border-blue-200 transition-all flex flex-col justify-between"
                >
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-slate-900">Dr. {doc.FirstName} {doc.LastName}</h3>
                    <p className="text-sm text-slate-500 mb-2">{doc.ExperienceYears} Years Experience</p>
                    <div className="flex gap-2 flex-wrap">
                      {doc.Availabilities.map((a: any) => (
                        <span key={a.DayOfWeek} className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][a.DayOfWeek]}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDoctorSelect(doc)}
                    className="w-full py-2 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-colors mt-4"
                  >
                    Select Doctor
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 3 && selectedDoctor && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in slide-in-from-right-8">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-500 bg-blue-50 p-2 rounded-xl"><CalendarIcon className="w-5 h-5" /></span>
              3. Choose Date & Details
            </h2>
            <button 
              onClick={() => setStep(2)}
              className="text-sm font-bold text-slate-500 hover:text-slate-900"
            >
              Back to Doctors
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-bold text-slate-800 mb-4">Select a Date</h3>
              <p className="text-sm text-slate-500 mb-4">
                Dr. {selectedDoctor.LastName} is available on:{" "}
                {selectedDoctor.Availabilities.map((a: any) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][a.DayOfWeek]).join(", ")}
              </p>
              
              <div className="calendar-container border border-slate-200 rounded-2xl p-4 inline-block bg-slate-50">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDate(date)}
                  filterDate={isDayAvailable}
                  inline
                  minDate={(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })()}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Visit (Optional)</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  rows={4}
                  placeholder="Briefly describe your symptoms or reason for visit..."
                />
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-2">Summary</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p className="flex justify-between">
                    <span>Doctor:</span> 
                    <span className="font-bold">Dr. {selectedDoctor.FirstName} {selectedDoctor.LastName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Speciality:</span> 
                    <span className="font-bold">{selectedSpecialization}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Date:</span> 
                    <span className="font-bold">{selectedDate ? selectedDate.toLocaleDateString() : 'Not selected'}</span>
                  </p>
                  <p className="flex justify-between pt-2 border-t border-blue-200 mt-2">
                    <span>Consultation Fee:</span> 
                    <span className="font-bold">₹{selectedDoctor.ConsultationFee.toString()}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={handleBook}
                disabled={!selectedDate || booking}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  !selectedDate || booking
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                }`}
              >
                {booking ? "Confirming..." : "Confirm Appointment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
