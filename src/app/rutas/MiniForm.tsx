import { useForm, SubmitHandler } from "react-hook-form";
import { ButtonSubmit } from "@/app/components/Button";

type InputProps = {
  email: string;
};

export default function MiniForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputProps>();
  const onSubmit: SubmitHandler<InputProps> = (data) => console.log(data);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full pt-5">
      {/* <input
        className="border border-gray-300 bg-transparent p-2.5 px-5"
        {...register("email", { required: true })}
      />
      {errors.email && <span>This field is required</span>} */}

      <label className="sr-only" htmlFor="email">email</label>
      <input
        id="email"
        {...register("email", {
          required: "required",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Entered value does not match email format",
          },
        })}
        type="email"
        placeholder="Tu email"
        className="rounded-l-xl border border-gray-300 bg-transparent p-2.5 px-5 w-full"
      />
      {errors.email && <span role="alert">{errors.email.message}</span>}

      <ButtonSubmit className="rounded-l-none" text="Agendar excursión" />
    </form>
  );
}
