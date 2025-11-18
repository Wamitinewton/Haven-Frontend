import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ForgotPasswordForm } from "../../components/auth/ForgotPasswordForm";
import { ROUTES } from "../../utils/constants";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [, setEmail] = useState("");

  const handleSuccess = (userEmail) => {
    setEmail(userEmail);
    navigate(ROUTES.RESET_PASSWORD, { state: { email: userEmail } });
  };

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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
        </div>

        <ForgotPasswordForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};
