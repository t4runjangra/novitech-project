import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import { Button } from "./ui/button.jsx";
import API from '../services/api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from 'lucide-react';
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

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await API.post('/users/login', {
        email: email.trim(),
        password
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      console.log(data);
      
      navigate('/dashboard');
      showSuccess("Login Successful");

    } catch (error) {
      showError("Login Failed");
      if (error.response) {
        if (error.response.status === 401) setError('Invalid email or password');
        else setError(error.response?.data?.message || 'Login failed');
      } else {
        setError('Network error. Please check your connection.');
      }
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
    <div className='bg-gray-200 h-screen flex justify-center items-center overflow-hidden'>
      <div className='h-3/4 w-full max-w-5xl flex justify-center bg-white rounded-2xl shadow-xl overflow-hidden'>
        <div className='w-1/2 flex justify-end items-center max-sm:hidden bg-blue-500'>
          <img
            src='/lady.png'
            alt="Login Illustration"
            className="object-contain h-full w-full opacity-90"
          />
        </div>

        <div className="flex items-center justify-start w-1/2 ml-10 max-sm:w-full max-sm:m-0 max-sm:p-6">
          <Card className="w-full max-w-md border-none shadow-none bg-transparent">
            <CardHeader className="space-y-1 p-0 pb-6">
              <motion.div custom={1} initial="hidden" animate="visible" variants={fadeInUp}>
                <CardTitle className="text-3xl font-bold text-slate-800 text-center lg:text-left">
                  Sign in to TaskFlow
                </CardTitle>
              </motion.div>
              <motion.div custom={2} initial="hidden" animate="visible" variants={fadeInUp}>
                <CardDescription className="text-slate-600 text-center lg:text-left">
                  Enter your credentials to access your account
                </CardDescription>
              </motion.div>
            </CardHeader>

            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeInUp}>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 p-0 pb-4">
                  {error && (
                    <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Password</Label>
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
                        disabled={isLoading}
                        className="focus:ring-2 focus:ring-blue-500 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 p-0">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                  </Button>
                  <div className="text-center text-sm text-slate-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-blue-600 hover:underline">
                      Sign up here
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

export default LoginForm;