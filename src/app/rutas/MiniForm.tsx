"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { ButtonSubmit } from "@/app/components/Button";
import { Fade } from "react-awesome-reveal";

type InputProps = {
  email: string;
};

interface MiniFormProps {
  openModal: () => void;
}

export default function MiniForm({ openModal }: MiniFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputProps>();

  const onSubmit: SubmitHandler<InputProps> = (data) => {
    console.log(data);
    openModal();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col pt-5"
      >
        <div className="flex w-full">
          <label className="sr-only" htmlFor="email">
            email
          </label>
          <input
            id="email"
            {...register("email", {
              required: "El campo de email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "El formato del email no es válido",
              },
            })}
            type="email"
            placeholder="Tu email"
            className="w-full rounded-l-xl border border-gray-300 bg-transparent p-2.5 px-5"
          />
          <ButtonSubmit className="rounded-l-none" text="Agendar excursión" />
        </div>
        {errors.email && (
          <Fade className="mt-2">
            <span
              role="alert"
              className=" self-start rounded-md bg-red-100 px-2 py-1.5 pt-1 text-red-500"
            >
              *{errors.email.message}
            </span>
          </Fade>
        )}
      </form>
    </>
  );
}
