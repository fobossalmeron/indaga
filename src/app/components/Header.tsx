export const Header = ({ title }: { title: string }) => {
  return (
    <header className="animate-fadeIn flex w-full max-w-[1020px] flex-col items-center gap-4 px-5 pt-12 pb-5 sm:pt-24 lg:flex-row">
      <div className="flex flex-col text-center lg:text-start">
        <h1 className="text-4xl md:text-5xl lg:text-6xl">{title}</h1>
      </div>
    </header>
  );
};
