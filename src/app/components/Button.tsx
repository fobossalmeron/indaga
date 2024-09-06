export const Button = ({
  children,
  onClick,
  secondary,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
}) => {
  return (
    <button
      className={`px-5 py-3 rounded-2xl ${
        secondary
          ? "border-2 border-fern text-fern bg-transparent"
          : "bg-fern text-white"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
