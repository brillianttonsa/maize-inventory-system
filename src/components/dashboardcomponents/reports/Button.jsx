const YELLOW_ACCENT_BG = "bg-yellow-500";
const YELLOW_ACCENT_HOVER = "hover:bg-yellow-600";
const YELLOW_ACCENT_RING = "focus:ring-yellow-500";
const YELLOW_OUTLINE_HOVER = "hover:bg-yellow-50 hover:text-yellow-600";

export const Button = ({
  children,
  variant = "default",
  size = "default",
  className,
  onClick,
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: `${YELLOW_ACCENT_BG} text-gray-900 ${YELLOW_ACCENT_HOVER} ${YELLOW_ACCENT_RING}`,
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: `border border-yellow-500 text-yellow-600 bg-white ${YELLOW_OUTLINE_HOVER}`,
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    ghost: `${YELLOW_OUTLINE_HOVER}`,
    link: "text-yellow-600 underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${base}, ${variants[variant]}, ${sizes[size]}, ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};