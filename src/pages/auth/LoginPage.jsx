import { LoginForm } from "../../components/auth/LoginForm";
import { LOGO, LOGIN_BG } from "../../assets";

export const LoginPage = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="p-2 flex items-center justify-center">
              <img src={LOGO} alt="Haven" className="w-12 h-12" />
            </div>
            <h1 className="text-xl font-semibold">Welcome Back</h1>
            <p className="text-gray-500 text-sm">
              Sign in to continue your wellness journey
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-gray-500 mt-6">
            Your mental health matters. We're here to support you.
          </p>
        </div>
        <img
          src={LOGIN_BG}
          alt="Register"
          className="w-1/2 h-full object-contain hidden md:block"
        />
      </div>
    </>
  );
};
