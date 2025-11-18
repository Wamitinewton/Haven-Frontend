import { IconLoader2 } from "@tabler/icons-react";

export const Button = ({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  ...props
}) => {
  const baseStyles =
    variant === "primary"
      ? "bg-black text-white hover:bg-black/80"
      : "bg-background text-foreground border border-foreground hover:bg-gray-100";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${className} p-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      {...props}
    >
      {loading && <IconLoader2 className="w-4 my-1.5 h-4 animate-spin" />}
      {loading ? "" : children}
    </button>
  );
};
