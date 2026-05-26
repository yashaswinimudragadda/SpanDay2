import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FaBalanceScale, FaUserLock, FaEye, FaEyeSlash } from 'react-icons/fa';

// 1. Explicit Validation Schema - This block handles all input checks rules strictly
const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email address is required.' })
    .email({ message: 'Please enter a valid email format (e.g., name@domain.com).' }),
  password: z
    .string()
    .nonempty({ message: 'Password is required.' })
    .min(6, { message: 'Security password must be at least 6 characters long.' })
});

export default function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // 2. Destructure properties from React Hook Form, plugging in our Zod validation engine
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched' // Checks input fields instantly when a user leaves the field
  });

  // 3. This triggers ONLY if Zod confirms all input values pass the schema checks
  const onSubmit = async (data) => {
    setAuthError('');
    
    // Simulating API verification delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (data.email === 'developer@indiaspan.com' && data.password === 'admin123') {
      setIsAuthenticated(true);
      navigate('/dashboard');
    } else {
      setAuthError('Authentication failed. Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-jurisCream flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans text-slate-800">
      
      {/* Background soft blur accents */}
      <div className="absolute top-[-10%] right-[-10%] w-125 h-125 rounded-full bg-[#0d233a]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 rounded-full bg-[#00a896]/10 blur-[120px] pointer-events-none" />
      
      {/* Central Login Card Container Container */}
      <div className="bg-jurisMilk p-8 rounded-2xl shadow-xl border border-slate-200/60 w-full max-w-md z-10">
        
        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 text-[#00a896] text-3xl mb-4 shadow-sm">
            <FaBalanceScale />
          </div>
          <h1 className="text-3xl font-extrabold text-[#0d233a] tracking-wide">JurisAI</h1>
          <p className="text-slate-500 text-xs mt-1.5 uppercase tracking-widest font-semibold">Legal Assistant Portal</p>
        </div>

        {/* Global Server/Auth Error Display */}
        {authError && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center font-semibold">
            {authError}
          </div>
        )}
        
        {/* Form elements mapped to React Hook Form handler */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Email Input Field Block */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Email Address
            </label>
            <input 
              type="text" 
              {...register('email')} // Connects validation rules to this input field
              placeholder="developer@indiaspan.com"
              className={`w-full bg-slate-50/50 border rounded-xl px-4 py-3 text-[#0d233a] text-sm placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                errors.email 
                  ? 'border-rose-400 focus:ring-1 focus:ring-rose-400/30' 
                  : 'border-slate-200 focus:border-[#00a896] focus:ring-1 focus:ring-[#00a896]/30'
              }`}
            />
            {/* Checked value warning response text */}
            {errors.email && (
              <p className="text-rose-600 text-xs mt-1.5 pl-1 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input Field Block */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Access Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                {...register('password')} // Connects validation rules to this input field
                placeholder="••••••••"
                className={`w-full bg-slate-50/50 border rounded-xl pl-4 pr-12 py-3 text-[#0d233a] text-sm placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                  errors.password 
                    ? 'border-rose-400 focus:ring-1 focus:ring-rose-400/30' 
                    : 'border-slate-200 focus:border-[#00a896] focus:ring-1 focus:ring-[#00a896]/30'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-sm"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {/* Checked value warning response text */}
            {errors.password && (
              <p className="text-rose-600 text-xs mt-1.5 pl-1 font-medium">{errors.password.message}</p>
            )}
          </div>
          
          {/* Submit Action Block */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#00a896] hover:bg-teal-600 disabled:bg-teal-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md shadow-teal-600/10 flex items-center justify-center gap-2 mt-2 text-sm select-none"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FaUserLock className="text-xs" /> Initialize Portal
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-5 border-t border-slate-200 text-center text-[11px] text-slate-400 tracking-wide font-medium">
          IndiaSpan Company Training Project Module
        </div>

      </div>
    </div>
  );
}