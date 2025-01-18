import { toast } from "../hooks/use-toast";
import supabase from "./supabase/supabase";

async function getUsers() {
  const { data: users, error } = await supabase.from("users").select("*");
  if (error) {
    // console.log(error);
    throw new Error(
      "somethin went wrog , check you connection internet and tyr again"
    );
  }
  return users;
}
async function getOneUser(user) {
  const { data } = await supabase
    .from("users")
    .select("*")
    // Filters
    .eq("id", user.id);
  return data;
}

export { getUsers, getOneUser };
