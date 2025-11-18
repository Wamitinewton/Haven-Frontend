import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../../components/common/Card";
import { OTPVerification } from "../../components/auth/OTPVerification";
import { ROUTES } from "../../utils/constants";
import authService from "../../services/auth.service";

export const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [loading, setLoading] = useState(false);

  const handleVerify = async (otpCode) => {
    setLoading(true);
    try {
      await authService.verifyEmail({ email, otpCode });
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    await authService.register({ email });
  };

  if (!email) {
    navigate(ROUTES.REGISTER);
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary-500 to-accent-500 mb-4 shadow-2xl">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            We've sent a verification code to your email
          </p>
        </div>

        <OTPVerification
          email={email}
          onVerify={handleVerify}
          onResend={handleResend}
          loading={loading}
        />

        <p className="text-center text-sm text-gray-500 mt-6">
          Check your spam folder if you don't see the email
        </p>
      </div>
    </div>
  );
};
