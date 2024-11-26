export const Header = ({
  title,
}: {
  title: string;
}) => {
  return (
    <header className="flex animate-fadeIn flex-col items-center gap-4 px-5 pb-5 pt-12 lg:flex-row sm:pt-24 w-full max-w-[1020px]">
      <div className="flex flex-col text-center lg:text-start">
        <h1 className="text-4xl md:text-5xl lg:text-6xl">{title}</h1>
      </div>
    </header>
  );
};
