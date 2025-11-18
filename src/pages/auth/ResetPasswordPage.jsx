import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../../components/common/Card";
import { OTPVerification } from "../../components/auth/OTPVerification";
import { ResetPasswordForm } from "../../components/auth/ResetPasswordForm";
import { ROUTES } from "../../utils/constants";
import authService from "../../services/auth.service";

export const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("otp");
  const [otpVerified, setOtpVerified] = useState(false);

  const handleVerifyOTP = async (otpCode) => {
    setLoading(true);
    try {
      await authService.verifyPasswordResetOTP({ email, otpCode });
      setOtpVerified(true);
      setStep("reset");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    await authService.requestPasswordReset({ email });
  };

  const handleResetSuccess = () => {
    navigate(ROUTES.LOGIN);
  };

  if (!email) {
    navigate(ROUTES.FORGOT_PASSWORD);
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black mb-4 shadow-2xl">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {step === "otp" ? "Verify Code" : "Reset Password"}
          </h1>
          <p className="text-gray-600">
            {step === "otp"
              ? "Enter the code we sent to your email"
              : "Create a new password for your account"}
          </p>
        </div>

        {step === "otp" ? (
          <OTPVerification
            email={email}
            onVerify={handleVerifyOTP}
            onResend={handleResendOTP}
            loading={loading}
          />
        ) : (
          <ResetPasswordForm
            email={email}
            otpVerified={otpVerified}
            onSuccess={handleResetSuccess}
          />
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          {step === "otp"
            ? "The code is valid for 10 minutes"
            : "Make sure to choose a strong password"}
        </p>
      </div>
    </div>
  );
};
