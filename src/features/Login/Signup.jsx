import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../../services/supabase/supabase";
import { useToast } from "../../hooks/use-toast";
import Spinner from "../../components/ui/spinner";
import { useNavigate } from "react-router-dom";

function Signup() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  function generateRandom8DigitNumber() {
    return Math.floor(Math.random() * 90000000) + 10000000;
  }

  const { mutate: CreateUser, isPending } = useMutation({
    mutationFn: async (data) => {
      const newUser = {
        ...data,
        balance: 2000,
        mouvements: [],
        cardNumber: generateRandom8DigitNumber(),
      };
      await supabase
        .from("users")
        .insert([{ ...newUser }])
        .select();
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast({
        // className: "bg-green-200 text-green-700",
        description: "your account created successfully ",
      });
      navigate("/");
    },
  });

  function OnSubmit(data) {
    console.log(data);
    CreateUser(data);
    reset();
  }

  if (isPending)
    return (
      <div className="flex w-full h-screen justify-center items-center ">
        <Spinner />
      </div>
    );

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center px-4 ">
      <h1 className="font-medium">Sign Up form</h1>
      <form onSubmit={handleSubmit(OnSubmit)} className="">
        <Formrow>
          <Label>Email</Label>
          <Input required type="email" {...register("email")} />
          {/* <span className="text-xs text-red-500 w-full rounded-md">
            this field is required
          </span> */}
        </Formrow>
        <Formrow>
          <Label>First name</Label>
          <Input required type="text" {...register("firstName")} />
        </Formrow>
        <Formrow>
          <Label>Last name</Label>
          <Input required type="text" {...register("lastName")} />
        </Formrow>
        <Formrow>
          <Label>your country</Label>
          <Input requiredtype="text" {...register("nationality")} />
        </Formrow>
        <Formrow>
          <Label> Create your password</Label>
          <Input required type="password" {...register("password")} />
        </Formrow>
        <Button>Sign Up</Button>
      </form>
    </div>
  );
}

function Formrow({ children }) {
  return <div className="flex flex-col items-start py-2 gap-2">{children}</div>;
}
export default Signup;
