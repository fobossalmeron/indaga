"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { ButtonSubmit } from "@/app/components/Button";
import { Fade } from "react-awesome-reveal";
import { useState } from "react";
import { KeyTextField } from "@prismicio/client";

interface MiniFormProps {
  openModal: () => void;
  route: KeyTextField;
}

export default function MiniForm({ openModal, route }: MiniFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, route }),
      });

      if (response.ok) {
        console.log('Email y ruta guardados exitosamente');
        openModal();
      } else {
        console.error('Error al guardar el email y la ruta');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col pt-5"
      >
        <div className="flex w-full flex-col xsm:flex-row gap-2 xsm:gap-0">
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
            className="w-full rounded-xl xsm:rounded-r-none border border-gray-300 bg-transparent p-2.5 px-5 transition-all duration-300 ease-in-out hover:border-fern hover:shadow-[0_0_10px_rgba(82,116,66,0.5)] focus:border-fern focus:outline-none"
          />
          <ButtonSubmit 
            className="xsm:rounded-l-none" 
            text={"Agendar excursión"}
            loading={isSubmitting}
          />
        </div>
        {errors.email && (
          <Fade className="mt-2">
            <span
              role="alert"
              className="self-start rounded-md bg-red-100 px-2 py-1.5 pt-1 text-red-500"
            >
              *{errors.email.message}
            </span>
          </Fade>
        )}
      </form>
    </>
  );
}
