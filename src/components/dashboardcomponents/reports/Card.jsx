
export const Card = ({ children, className }) => (
  <div className={`rounded-lg border bg-white text-gray-900 shadow-md transition-all ${className}`}>
    {children}
  </div>
);

Card.Header = ({ children, className }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

Card.Title = ({ children, className }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

Card.Description = ({ children, className }) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);

Card.Content = ({ children, className }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);
