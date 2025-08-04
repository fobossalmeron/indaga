import React from "react";

const BUTTON_STYLES = {
  base: "px-6 transition-all font-medium rounded-xl flex gap-1.5 items-center justify-center cursor-pointer",
  primary: "bg-accent text-white hover:bg-accent-600 active:bg-accent-600",
  secondary:
    "border-2 border-accent text-accent bg-transparent hover:bg-primary-100 active:bg-primary-100",
  thin: "py-2",
  normal: "py-2.5",
  fullWidth: "w-full",
};

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  fullWidth?: boolean;
  thin?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * @deprecated Use the `Button` component from `src/app/components/ui/button.tsx` instead.
 */
export const Button = React.memo(
  ({
    children,
    onClick,
    secondary = false,
    fullWidth = false,
    thin = false,
    className = "",
    ...rest
  }: ButtonProps) => {
    const buttonClasses = `
    ${BUTTON_STYLES.base}
    ${thin ? BUTTON_STYLES.thin : BUTTON_STYLES.normal}
    ${secondary ? BUTTON_STYLES.secondary : BUTTON_STYLES.primary}
    ${fullWidth ? BUTTON_STYLES.fullWidth : ""}
    ${className}
  `.trim();

    return (
      <button className={buttonClasses} onClick={onClick} {...rest}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

/**
 * @deprecated Use the `Button` component from `src/app/components/ui/button.tsx` instead.
 */
export const ButtonSubmit = ({
  text,
  className,
  loading,
}: {
  text: string;
  className?: string;
  loading?: boolean;
}) => {
  const buttonClasses = `${BUTTON_STYLES.base} ${BUTTON_STYLES.primary} ${BUTTON_STYLES.normal} ${className} min-w-[185px]`;

  return (
    <button type="submit" className={buttonClasses} disabled={loading}>
      {loading ? <div className="loader mr-2" /> : text}
    </button>
  );
};
