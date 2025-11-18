import { RegisterForm } from "../../components/auth/RegisterForm";
import { REGISTER_BG } from "../../assets";

export const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center md:gap-4 p-4">
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-black">
            Create Your Account
          </h1>
          <p className="text-gray-500 text-sm">
            Begin your journey to better mental health
          </p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-gray-500 mt-6">
          Join thousands on their path to wellness
        </p>
      </div>
      <img
        src={REGISTER_BG}
        alt="Register"
        className="w-1/2 h-full object-contain hidden md:block"
      />
    </div>
  );
};
