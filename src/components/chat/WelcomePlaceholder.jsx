import { useAuth } from "../../hooks/useAuth";
import { LOGO } from "../../assets";
export const WelcomePlaceholder = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const firstName = user?.full_name?.split(" ")[0] || "User";

  return (
    <div className="flex-1 flex flex-col justify-center items-center h-full p-8 text-center">
      <div className="">
        <img src={LOGO} alt="Haven" className="w-24 h-24" />
      </div>
      <h2 className="text-3xl font-bold text-black mb-2">
        {getGreeting()}, {firstName}
      </h2>
      <p className="text-gray-600 text-base max-w-md">
        Hey there! What can I help you with today?
      </p>
    </div>
  );
};
