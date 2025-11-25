import { useState } from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Alert } from "../common/Alert";
import { Modal } from "../common/Modal";
import { OTPVerification } from "./OTPVerification";
import { validatePassword, getPasswordStrength } from "../../utils/validators";
import authService from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";

export const ChangePasswordForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingNewPassword, setPendingNewPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "newPassword") {
      setPasswordStrength(getPasswordStrength(value));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Current password is required";
    }

    if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.oldPassword === formData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!validate()) return;

    setLoading(true);

    try {
      await authService.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setPendingNewPassword(formData.newPassword);
      setShowOTPModal(true);
      setAlert({
        type: "info",
        message: "Please check your email for the verification code",
      });
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to change password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otpCode) => {
    await authService.verifyPasswordChange({
      email: user.email,
      otpCode,
      newPassword: pendingNewPassword,
    });

    setAlert({
      type: "success",
      message: "Password changed successfully!",
    });

    setShowOTPModal(false);
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPendingNewPassword("");

    if (onSuccess) {
      setTimeout(onSuccess, 1500);
    }
  };

  const handleResendOTP = async () => {
    await authService.changePassword({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {alert && !showOTPModal && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <Input
          label="Current Password"
          name="oldPassword"
          type="password"
          value={formData.oldPassword}
          onChange={handleChange}
          error={errors.oldPassword}
          placeholder="••••••••"
          showPasswordToggle
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
        />

        <div>
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            placeholder="••••••••"
            showPasswordToggle
            icon={
              <svg
                className="w-5 h-5"
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
            }
          />
          {passwordStrength && formData.newPassword && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      passwordStrength.level === "weak" && level === 1
                        ? "bg-red-500"
                        : passwordStrength.level === "medium" && level <= 2
                        ? "bg-yellow-500"
                        : passwordStrength.level === "strong"
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p
                className={`text-xs font-medium ${
                  passwordStrength.level === "weak"
                    ? "text-red-600"
                    : passwordStrength.level === "medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                Password strength: {passwordStrength.level}
              </p>
            </div>
          )}
        </div>

        <Input
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="••••••••"
          showPasswordToggle
          icon={
            <svg
              className="w-5 h-5"
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
          }
        />

        <Button type="submit" loading={loading} className="w-full">
          Change Password
        </Button>
      </form>

      <Modal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        title="Verify Password Change"
      >
        <OTPVerification
          email={user?.email}
          onVerify={handleVerifyOTP}
          onResend={handleResendOTP}
          loading={loading}
        />
      </Modal>
    </>
  );
};
