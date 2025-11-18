import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Alert } from "../common/Alert";
import { ROUTES } from "../../utils/constants";
import {
  validateEmail,
  validatePassword,
  validateFullName,
  getPasswordStrength,
} from "../../utils/validators";
import authService from "../../services/auth.service";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!validateFullName(formData.fullName)) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      setAlert({
        type: "success",
        message:
          "Registration successful! Please check your email for the verification code.",
      });

      setTimeout(() => {
        navigate(ROUTES.VERIFY_EMAIL, { state: { email: formData.email } });
      }, 2000);
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <Input
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        error={errors.fullName}
        placeholder="John Doe"
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="you@example.com"
      />

      <div>
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="••••••••"
          showPasswordToggle
        />
        {passwordStrength && formData.password && (
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
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        placeholder="••••••••"
        showPasswordToggle
      />

      <Button type="submit" loading={loading} className="w-full">
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="font-semibold text-black hover:text-black/80"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};
