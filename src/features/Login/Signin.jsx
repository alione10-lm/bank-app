import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { getUsers } from "../../services/apiUsers";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { useDispatch } from "react-redux";
import { Login } from "../../redux/userSlice";

function Signin() {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    formState: { isLoading, errors },
    register,
  } = useForm();

  const { data: users, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  const navigate = useNavigate();

  function OnSubmit(data) {
    const currentUser = users.find(
      (user) => user.email === data.email && user.password === data.password
    );
    currentUser === undefined &&
      toast({
        description: "invalid credentials",
      });
    currentUser && dispatch(Login(currentUser));
    currentUser && navigate("app");

    localStorage.setItem("user", JSON.stringify(currentUser));
  }

  if (error) return <p>{error.message}</p>;

  return (
    <div className="w-full h-screen flex flex-col justify-center gap-4 items-center px-4 ">
      <form onSubmit={handleSubmit(OnSubmit)} className="">
        <Formrow>
          <Label>Email</Label>
          <Input type="email" {...register("email")} />
        </Formrow>
        <Formrow>
          <Label>Password</Label>
          <Input type="password" {...register("password")} />
        </Formrow>
        <Button>Sign in</Button>
      </form>
      <p className="">
        if you don't have account
        <br />
        <Link to="/signup" className="text-indigo-500">
          sign up &rarr;
        </Link>
      </p>
    </div>
  );
}

function Formrow({ children }) {
  return <div className="flex flex-col items-start py-2 gap-2">{children}</div>;
}
export default Signin;
