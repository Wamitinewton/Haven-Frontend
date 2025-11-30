export const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`rounded-3xl hover:shadow-xs transition-all duration-300 border border-gray-200 p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
