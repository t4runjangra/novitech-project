import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import API from '../services/api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff, Check, X } from 'lucide-react';

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

  // Password requirements
  const passwordRequirements = [
    { id: 'length', text: 'At least 8 characters', regex: /.{8,}/ },
    { id: 'lowercase', text: 'At least one lowercase letter', regex: /[a-z]/ },
    { id: 'uppercase', text: 'At least one uppercase letter', regex: /[A-Z]/ },
    { id: 'number', text: 'At least one number', regex: /\d/ },
    { id: 'special', text: 'At least one special character', regex: /[!@#$%^&*(),.?":{}|<>]/ }
  ];

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Check password strength
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
    // Clear field-specific error
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: '' }));
    }
    if (error) setError('');
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength < 3) {
      errors.password = 'Password is too weak';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getStrengthColor = (strength) => {
    if (strength < 2) return 'bg-red-500';
    if (strength < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength) => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setFormErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      };

      const { data } = await API.post('/user/register', registrationData);
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      // Update context
      setUser(data);
      
      // Show success message
      console.log('Registration successful!');
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        if (error.response.status === 409) {
          setError('Email already exists. Please use a different email or login.');
        } else if (error.response.status === 400) {
          setError(error.response?.data?.message || 'Invalid registration data');
        } else if (error.response.status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(error.response?.data?.message || 'Registration failed');
        }
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleRegister(e);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-slate-800">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-center text-slate-600">
            Join thousands of users managing their tasks efficiently
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Full Name
              </Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                onKeyPress={handleKeyPress}
                className={`focus:ring-2 ${formErrors.name ? 'border-red-300 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                autoComplete="name"
                required 
              />
              {formErrors.name && (
                <p className="text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email Address
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                onKeyPress={handleKeyPress}
                className={`focus:ring-2 ${formErrors.email ? 'border-red-300 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                autoComplete="email"
                required 
              />
              {formErrors.email && (
                <p className="text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  onKeyPress={handleKeyPress}
                  className={`focus:ring-2 pr-10 ${formErrors.password ? 'border-red-300 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                  autoComplete="new-password"
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Password strength:</span>
                    <span className={`text-sm font-medium ${
                      passwordStrength < 2 ? 'text-red-600' :
                      passwordStrength < 4 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {getStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                      style={{ width: `${(passwordStrength / passwordRequirements.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              {/* Password requirements */}
              {formData.password && (
                <div className="space-y-1 mt-2">
                  {passwordRequirements.map((req) => {
                    const isValid = req.regex.test(formData.password);
                    return (
                      <div key={req.id} className="flex items-center gap-2">
                        {isValid ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                          {req.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {formErrors.password && (
                <p className="text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-700">
                Confirm Password
              </Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  onKeyPress={handleKeyPress}
                  className={`focus:ring-2 pr-10 ${formErrors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                  autoComplete="new-password"
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-600">{formErrors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <Label htmlFor="terms" className="ml-2 block text-sm text-slate-700">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            
            <div className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                Login here
              </Link>
            </div>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-600">Or continue with</span>
              </div>
            </div>
            
            {/* Social login options (optional) */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                disabled={isLoading}
                onClick={() => {/* Add Google OAuth */}}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                disabled={isLoading}
                onClick={() => {/* Add GitHub OAuth */}}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterForm;