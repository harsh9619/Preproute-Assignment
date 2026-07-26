import React from 'react';
import LOGIN_IMG from '../../style/images/img-login.svg';
import LOGO from '../../style/images/img-logo.svg';

interface FormErrors {
  userId?: string;
  password?: string;
}

interface LoginViewProps {
  userId: string;
  setUserId: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  errors: FormErrors;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

const LoginView: React.FC<LoginViewProps> = ({
  userId,
  setUserId,
  password,
  setPassword,
  errors,
  isSubmitting,
  handleSubmit
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row items-center bg-slate-50 p-4 sm:p-6 lg:p-4 gap-4 lg:gap-4">
      {/* Left — 50% illustration panel */}
      <div className="hidden lg:flex w-1/2 h-[calc(100vh-2rem)] items-start justify-center pt-12 sm:pt-16">
        <img
          src={LOGIN_IMG}
          alt="Login Illustration"
          className="w-full max-w-xl"
        />
      </div>

      {/* Right — 50% login panel */}
      <div className="w-full lg:w-1/2 h-[calc(100vh-2rem)] bg-white rounded-2xl border border-blue-100 shadow-sm overflow-y-auto flex items-center justify-center">
        <div className="max-w-md mx-auto px-8 sm:px-12 py-12">
          {/* Logo */}
          <div className="mb-10">
            <img
              src={LOGO}
              alt="Logo"
              className="w-full max-w-xl"
            />
          </div>

          <h1 className="text-2xl font-semibold text-slate-800 mb-1">
            Login
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Use your company provided Login credentials
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                User ID
              </label>
              <input
                placeholder="Enter User ID"
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
              {errors.userId && <span className="text-xs text-red-500">{errors.userId}</span>}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                disabled={isSubmitting}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
              {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
            </div>

            <div>
              <a
                href="#"
                className="text-sm text-blue-500 hover:text-blue-600 hover:underline transition"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-400 hover:bg-indigo-500 active:bg-indigo-600 text-white font-medium py-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
