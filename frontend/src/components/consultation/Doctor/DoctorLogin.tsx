import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { BACKEND_URL } from "../services/api.ts";
import DuplicateEmail from '../FlashyMessage/DuplicateEmail.js';
import DoctorLogo from "../../../../public/icon/DoctorLogo.tsx";

const DoctorLogin = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);
    const [customEmail, setCustomEmail] = useState('');

    const handleGoogleLogin = async (credentialResponse: any) => {
        setIsLoading(true);
        try {
            const { data } = await axios.post(
                `${BACKEND_URL}/api/auth/generateTokenD`,
                { token: credentialResponse.credential }
            );
            if (data.token === 'tokenNotGranted') {
                setIsEmailDuplicate(true);
                return;
            }
            localStorage.setItem('token', data.token);
            onLoginSuccess();
        } catch (error) {
            console.error('Login failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDirectDoctorLogin = async (emailToUse?: string) => {
        setIsLoading(true);
        try {
            const email = (emailToUse || customEmail || "dr.ananya.sharma@swaraksha.org").trim();
            const { data } = await axios.post(
                `${BACKEND_URL}/api/auth/generateTokenD`,
                { 
                    email: email,
                    name: "Dr. Ananya Sharma",
                    specialty: "Cardiologist",
                    picture: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
                }
            );
            if (data.token === 'tokenNotGranted') {
                setIsEmailDuplicate(true);
                return;
            }
            localStorage.setItem('token', data.token);
            onLoginSuccess();
        } catch (error) {
            console.error('Direct doctor login failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen py-8">
            <div className="flex flex-col lg:flex-row items-center bg-white shadow-xl rounded-2xl overflow-hidden max-w-4xl w-full mx-4 border border-gray-100">
                <div className="p-8 lg:w-1/2 flex flex-col justify-center w-full">
                    <div className="text-center mb-2">
                        <DoctorLogo className="mx-auto w-20 h-20" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">Doctor Sign In</h2>
                    <p className="text-gray-500 text-sm text-center mb-6">Manage your patient consultations and clinical schedules.</p>
                    
                    {/* Google Login Option */}
                    <div className="flex justify-center mb-4">
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => console.log('Google Login Failed')}
                            theme="outline"
                            size="large"
                            shape="rectangular"
                        />
                    </div>

                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">or sign in directly</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Quick Demo Sign In Button */}
                    <button
                        onClick={() => handleDirectDoctorLogin("dr.ananya.sharma@swaraksha.org")}
                        disabled={isLoading}
                        className="w-full mb-3 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                    >
                        <span>🩺</span>
                        <span>{isLoading ? 'Signing In...' : 'Quick Demo Doctor Sign In'}</span>
                    </button>

                    {/* Custom Email Sign In */}
                    <div className="flex gap-2 mt-1">
                        <input
                            type="email"
                            placeholder="Enter doctor email address"
                            value={customEmail}
                            onChange={(e) => setCustomEmail(e.target.value)}
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                        <button
                            onClick={() => handleDirectDoctorLogin()}
                            disabled={isLoading || !customEmail.includes('@')}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition duration-200 disabled:opacity-50"
                        >
                            Continue
                        </button>
                    </div>

                    {isEmailDuplicate && (
                        <div className="mt-4">
                            <DuplicateEmail message="A Patient Account with This Email Already Exists" />
                        </div>
                    )}
                </div>
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#175134] to-[#28a745] items-center justify-center p-12 self-stretch">
                    <div className="text-white text-center">
                        <h4 className="mb-4 text-3xl font-bold tracking-tight">Efficient Care Navigation</h4>
                        <p className="text-emerald-50 text-sm leading-relaxed">Streamline consultation requests, securely access diagnostic reports, and join encrypted telemedicine rooms with SwaRaksha AI.</p>
                        <div className="mt-8 flex justify-center gap-4 text-xs text-emerald-100">
                            <span className="flex items-center gap-1">✓ Real-time Patient Queue</span>
                            <span className="flex items-center gap-1">✓ Integrated Telehealth</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorLogin;
