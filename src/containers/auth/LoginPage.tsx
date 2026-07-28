import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../store';
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

  useEffect(() => {
    // If already logged in, redirect directly to dashboard
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validateField = (field: 'userId' | 'password', value: string): string | undefined => {
    if (field === 'userId') {
      if (!value.trim()) {
        return 'User ID is required';
      }
    }
    if (field === 'password') {
      if (!value) {
        return 'Password is required';
      } else if (value.length < 3) {
        return 'Password must be at least 3 characters';
      }
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const userIdError = validateField('userId', userId);
    const passwordError = validateField('password', password);
    const newErrors: FormErrors = {};
    if (userIdError) newErrors.userId = userIdError;
    if (passwordError) newErrors.password = passwordError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: 'userId' | 'password') => {
    const value = field === 'userId' ? userId : password;
    const error = validateField(field, value);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await login(userId.trim(), password);
      setIsSubmitting(false);
      if (result.success) {
        toast.success(`Login successful! Welcome back ${result.user?.name || 'User'}!`);
        navigate('/');
      } else {
        toast.error(result.message || 'Invalid User ID or password');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      toast.error(err.message || 'An error occurred during login');
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
      onBlurField={handleBlur}
    />
  );
};

export default LoginPage;
