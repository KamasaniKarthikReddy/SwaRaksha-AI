import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/NavBar.tsx";
import FallBackUi from "../Fallback/FallbackUi.js";
import SuccessMessage from "../FlashyMessage/SuccessMessage.js";
import DoctorLogin from "./DoctorLogin";
import Copyright from "../Copyright/Copyright";
import { BACKEND_URL } from "../services/api.ts";
import { Users, Video, Calendar, Clock, RefreshCw, CheckCircle2 } from "lucide-react";
import "./doctor.css";

interface PatientRequest {
  email: string;
  name: string;
  picture?: string;
  requestedDoctorIds: string[];
  status: string;
  roomId: string;
}

function PatientDataVisual() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFlashy, setShowFlashy] = useState(false);
  const [requests, setRequests] = useState<PatientRequest[]>([]);
  const [isFetchingRequests, setIsFetchingRequests] = useState(false);
  const [quickRoomId, setQuickRoomId] = useState("");

  const verifyDoctorAndLoadRequests = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const verifyRes = await axios.post(`${BACKEND_URL}/api/auth/verify`, { token });
      if (verifyRes.data.role === "doctor") {
        setIsAuthenticated(true);
        await fetchDoctorRequests(token);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Doctor verification error:", err);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctorRequests = async (token: string) => {
    setIsFetchingRequests(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/consultation/doctor-requests`, { token });
      if (res.data?.requests) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error("Failed to fetch doctor requests:", err);
    } finally {
      setIsFetchingRequests(false);
    }
  };

  useEffect(() => {
    verifyDoctorAndLoadRequests();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowFlashy(true);
    const token = localStorage.getItem("token");
    if (token) fetchDoctorRequests(token);
  };

  const handleStartConsultation = (roomId: string) => {
    navigate(`/consultation/doctor/schedule/${roomId}`);
  };

  if (isLoading) {
    return <FallBackUi />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-50">
        <Navbar isDoctor={false} isLogout={false} isPatient={false} />
        <DoctorLogin onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar isDoctor={true} isLogout={true} isPatient={false} />
      {showFlashy && <SuccessMessage message="Logged in as Doctor" />}

      <div className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-4 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Clinical Consultation Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage incoming patient consultation requests and tele-health rooms.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const token = localStorage.getItem("token");
                if (token) fetchDoctorRequests(token);
              }}
              disabled={isFetchingRequests}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isFetchingRequests ? 'animate-spin text-emerald-600' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{requests.length}</div>
              <div className="text-xs font-medium text-gray-500">Active Patient Requests</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">Encrypted</div>
              <div className="text-xs font-medium text-gray-500">Telehealth Video Ready</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">Online</div>
              <div className="text-xs font-medium text-gray-500">Doctor Status: Available</div>
            </div>
          </div>
        </div>

        {/* Instant Telehealth Room Launcher */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white mb-8 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Quick Telemedicine Video Room</h2>
              <p className="text-emerald-100 text-xs mt-1">Enter any room identifier to launch an instant 1-on-1 consultation video session.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="text"
                placeholder="e.g. consult-room-101"
                value={quickRoomId}
                onChange={(e) => setQuickRoomId(e.target.value)}
                className="px-4 py-2 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full md:w-64"
              />
              <button
                onClick={() => {
                  if (quickRoomId.trim()) handleStartConsultation(quickRoomId.trim());
                }}
                disabled={!quickRoomId.trim()}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-lg text-sm transition shadow disabled:opacity-50 whitespace-nowrap"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>

        {/* Patient Consultation Requests Queue */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Incoming Consultation Queue</h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              {requests.length} Queued
            </span>
          </div>

          {requests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Queue is Clear</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                No active consultation requests found at this moment. When patients request a consultation from the Patient Portal, their requests will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {requests.map((req, index) => (
                <div key={index} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-lg flex-shrink-0">
                      {req.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{req.name}</div>
                      <div className="text-xs text-gray-500">{req.email}</div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-emerald-600 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Ready for Video Consultation</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={() => handleStartConsultation(req.roomId)}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
                    >
                      <Video className="w-4 h-4" />
                      <span>Start Video Consult</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Copyright />
    </div>
  );
}

export default PatientDataVisual;
