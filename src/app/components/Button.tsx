import React from 'react';

const BUTTON_STYLES = {
  base: "px-6 transition-all font-medium rounded-xl flex gap-1.5 items-center justify-center cursor-pointer",
  primary: "bg-fern text-white hover:bg-[#3C5530]",
  secondary: "border-2 border-fern text-fern bg-transparent hover:bg-[#CAE47C50]",
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

export const ButtonSubmit = ({ text }: { text: string }) => {
  const buttonClasses = `${BUTTON_STYLES.base} ${BUTTON_STYLES.primary}`;

  return <input value={text} type="submit" className={buttonClasses} />;
};