import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import { Button } from "./ui/button.jsx";
import API from '../services/api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff, CheckSquare } from 'lucide-react';
import { useToast } from '../context/toastContext.jsx';
import { motion } from 'framer-motion';

const LoginForm = () => {
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data } = await API.post('/users/login', {
        email: email.trim(),
        password
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      navigate('/dashboard');
      showSuccess("Login Successful");
    } catch (error) {
      showError("Login Failed");
      setError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
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
            alt="Login Illustration"
            className="object-contain max-h-full w-full opacity-90 drop-shadow-2xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="space-y-1 p-0 pb-8">
              <motion.div custom={1} initial="hidden" animate="visible" variants={fadeInUp}>
                <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center md:text-left">
                  Sign in to TaskFlow
                </CardTitle>
              </motion.div>
              <motion.div custom={2} initial="hidden" animate="visible" variants={fadeInUp}>
                <CardDescription className="text-slate-500 dark:text-slate-400 text-center md:text-left">
                  Enter your credentials to access your account
                </CardDescription>
              </motion.div>
            </CardHeader>

            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeInUp}>
              <form onSubmit={handleLogin} className="space-y-5">
                <CardContent className="space-y-4 p-0">
                  {error && (
                    <div className="p-3 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Password</Label>
                      <Link to="/forgot-password" size="sm" className="text-sm text-blue-600 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 p-0 pt-4">
                  <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all active:scale-95"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                  </Button>
                  <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      Sign up here
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

export default LoginForm;