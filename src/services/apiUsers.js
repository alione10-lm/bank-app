import supabase from "./supabase/supabase";

async function getUsers() {
  const { data: users, error } = await supabase.from("users").select("*");
  if (error) {
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

async function ReceiverUser(cardNumber) {
  let { data: user } = await supabase
    .from("users")
    .select("*")

    // Filters
    .eq("cardNumber", cardNumber);
  return user;
}

async function createNotifications(AuthUser, data, user) {
  await supabase
    .from("notifications")
    .insert([
      {
        user_id: AuthUser.id,
        content: `money transfer  of ${data.amount}, to ${data.username}`,
      },
      {
        user_id: data.id,
        content: `money transfer  of ${data.amount},from ${user[0].firstName}`,
      },
    ])
    .select();
}

export { getUsers, getOneUser, ReceiverUser, createNotifications };
