import React from 'react';

const BUTTON_STYLES = {
  base: "px-6 transition-all font-medium rounded-xl flex gap-1.5 items-center justify-center cursor-pointer",
  primary: "bg-fern text-white hover:bg-[#006670] active:bg-[#006670]",
  secondary: "border-2 border-fern text-fern bg-transparent hover:bg-[#00667020] active:bg-[#00667020]",
  thin: "py-2",
  normal: "py-2.5",
  fullWidth: "w-full"
};

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  fullWidth?: boolean;
  thin?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.memo(({
  children,
  onClick,
  secondary = false,
  fullWidth = false,
  thin = false,
  className = '',
  ...rest
}: ButtonProps) => {
  const buttonClasses = `
    ${BUTTON_STYLES.base}
    ${thin ? BUTTON_STYLES.thin : BUTTON_STYLES.normal}
    ${secondary ? BUTTON_STYLES.secondary : BUTTON_STYLES.primary}
    ${fullWidth ? BUTTON_STYLES.fullWidth : ''}
    ${className}
  `.trim();

  return (
    <button className={buttonClasses} onClick={onClick} {...rest}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export const ButtonSubmit = ({ text, className, loading }: { text: string, className?: string, loading?: boolean }) => {
  const buttonClasses = `${BUTTON_STYLES.base} ${BUTTON_STYLES.primary} ${BUTTON_STYLES.normal} ${className} min-w-[185px]`;

  return (
    <button type="submit" className={buttonClasses} disabled={loading}>
      {loading ?           <div className="loader mr-2" />
 : text}
    </button>
  );
};
