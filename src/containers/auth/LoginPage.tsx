import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useTast } from '../../store';
import LoginView from '../../components/auth/LoginView';

interface FormErrors {
  userId?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect(() => {
  //   // If already logged in, redirect directly to dashboard
  //   if (isAuthenticated) {
  //     navigate('/');
  //   }
  // }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!userId.trim()) {
      newErrors.userId = 'User ID is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await login(userId.trim(), password);
      setIsSubmitting(false);
      if (result.success) {
         window.alert(`Login successful! Welcome back ${result.user?.name || 'User'}!`);
      } else {
        
         window.alert(result.message || 'Invalid User ID or password');
      }
    } catch (err: any) {
      setIsSubmitting(false);
       window.alert(err.message || 'An error occurred during login');
    }
  };

  return (
    <LoginView
      userId={userId}
      setUserId={setUserId}
      password={password}
      setPassword={setPassword}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
    />
  );
};

export default LoginPage;
