import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Button } from "@/components/ui/button.jsx";
import API from '../services/api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const { setUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const passwordRequirements = [
    { id: 'length', regex: /.{8,}/ },
    { id: 'lowercase', regex: /[a-z]/ },
    { id: 'uppercase', regex: /[A-Z]/ },
    { id: 'number', regex: /\d/ },
    { id: 'special', regex: /[!@#$%^&*(),.?":{}|<>]/ }
  ];

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    if (formData.password) {
      const strength = passwordRequirements.reduce((score, req) => {
        return score + (req.regex.test(formData.password) ? 1 : 0);
      }, 0);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (formErrors[id]) setFormErrors(prev => ({ ...prev, [id]: '' }));
    if (error) setError('');
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Valid email required';
    if (formData.password.length < 8) errors.password = 'Too short';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords mismatch';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const { data } = await API.post('/users/register', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(true);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.15, duration: 0.5, ease: "easeOut" }
    })
  };

  return (
    <div className='bg-gray-200 dark:bg-slate-950 min-h-screen flex flex-col justify-center items-center transition-colors duration-300 p-4'>
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-center z-10">
        <div className='flex items-center justify-between w-full max-w-5xl h-16 rounded-2xl shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 md:px-12 border border-white/20 dark:border-slate-800'>
          <div className="flex items-center gap-2 font-bold text-2xl text-blue-600 dark:text-blue-400">
            <CheckSquare className="h-6 w-6" />
            <span>TaskFlow</span>
          </div>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Need help? <a href="#" className="text-blue-600 hover:underline">Support</a>
          </div>
        </div>
      </nav>

      <div className='w-full max-w-5xl flex bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden mt-20 min-h-150 border border-slate-100 dark:border-slate-800'>
        <div className='hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center p-12'>
          <img
            src='/lady.png'
            alt="Register Illustration"
            className="object-contain max-h-full w-full opacity-90 drop-shadow-2xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="space-y-1 p-0 pb-6">
              <motion.div custom={1} initial="hidden" animate="visible" variants={fadeInUp}>
                <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center md:text-left">
                  Create Your Account
                </CardTitle>
              </motion.div>
              <motion.div custom={2} initial="hidden" animate="visible" variants={fadeInUp}>
                <CardDescription className="text-slate-500 dark:text-slate-400 text-center md:text-left">
                  Join <span className='font-bold text-blue-600 dark:text-blue-400'>TaskFlow</span> and manage your work efficiently.
                </CardDescription>
              </motion.div>
            </CardHeader>

            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeInUp}>
              <form onSubmit={handleRegister} className="space-y-3">
                <CardContent className="space-y-3 p-0 pb-4">
                  {error && (
                    <div className="p-3 text-xs bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl">
                      {error}
                    </div>
                  )}

                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Full Name</Label>
                    <Input id="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="h-10 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" required />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="h-10 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" required />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="password" title="Password" className="text-slate-700 dark:text-slate-300">Password</Label>
                      <div className="relative">
                        <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} className="h-10 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 pr-9" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="confirmPassword" title="Confirm" className="text-slate-700 dark:text-slate-300">Confirm</Label>
                      <div className="relative">
                        <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} className="h-10 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 pr-9" required />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {formData.password && (
                    <div className="space-y-1 pt-1">
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                          className={`h-full transition-colors duration-300 ${passwordStrength < 3 ? 'bg-red-500' : passwordStrength < 5 ? 'bg-amber-500' : 'bg-green-500'}`}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 p-0">
                  <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                  </Button>
                  <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      Login here
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </motion.div>
          </Card>
        </div>
      </div>
      
      <footer className="mt-8 pb-6 w-full text-center text-xs text-slate-500 dark:text-slate-500">
        <div className="flex justify-center gap-6 mb-3">
          <Link to="/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-blue-500 transition-colors">Terms of Service</Link>
          <Link to="/contact" className="hover:text-blue-500 transition-colors">Contact Us</Link>
        </div>
        <p>© 2026 TaskFlow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RegisterForm;