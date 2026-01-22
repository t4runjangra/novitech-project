import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Button } from "@/components/ui/button.jsx";
import API from '../services/api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff, Check, X } from 'lucide-react';
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
    { id: 'length', text: 'At least 8 characters', regex: /.{8,}/ },
    { id: 'lowercase', text: 'At least one lowercase letter', regex: /[a-z]/ },
    { id: 'uppercase', text: 'At least one uppercase letter', regex: /[A-Z]/ },
    { id: 'number', text: 'At least one number', regex: /\d/ },
    { id: 'special', text: 'At least one special character', regex: /[!@#$%^&*(),.?":{}|<>]/ }
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
      setIsLoading(false);
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
    <div className='bg-gray-200 h-screen flex justify-center items-center overflow-hidden'>
      <div className='h-3/4 w-full max-w-5xl flex justify-center bg-white rounded-2xl shadow-xl overflow-hidden'>
        <div className='w-1/2 flex justify-end items-center max-sm:hidden bg-blue-500'>
          <img
            src='/lady.png'
            alt="Register Illustration"
            className="object-contain h-full w-full opacity-90"
          />
        </div>
        <div className="flex items-center justify-start w-1/2 ml-10 max-sm:w-full max-sm:m-0 max-sm:p-6 overflow-y-auto">
          <Card className="w-full max-w-md border-none shadow-none bg-transparent">
            <CardHeader className="space-y-1 p-0 pb-6">
              <motion.div custom={1} initial="hidden" animate="visible" variants={fadeInUp}>
                <CardTitle className="text-3xl font-bold text-slate-800">
                  Create Your Account
                </CardTitle>
              </motion.div>
              <motion.div custom={2} initial="hidden" animate="visible" variants={fadeInUp}>
                <CardDescription className="text-slate-600">
                  Join <span className='font-bold'> TaskFlow </span> and manage your work efficiently.
                </CardDescription>
              </motion.div>
            </CardHeader>

            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeInUp}>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-3 p-0 pb-4">
                  {error && (
                    <div className="p-2 text-xs bg-red-50 border border-red-200 text-red-600 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="space-y-1">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="confirmPassword">Confirm</Label>
                      <div className="relative">
                        <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} required />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {formData.password && (
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-slate-100 rounded-full">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${passwordStrength < 3 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 p-0">
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
                  </Button>
                  <div className="text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:underline">
                      Login here
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </motion.div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default RegisterForm;