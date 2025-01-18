import { useEffect, useState } from "react";
import { getOneUser } from "../services/apiUsers";
import { useQuery } from "@tanstack/react-query";
import supabase from "../services/supabase/supabase";
import Spinner from "../components/ui/spinner";
import { formatDistanceToNow } from "date-fns";
import { Button } from "../components/ui/button";
import { Trash } from "lucide-react";

function Notifications() {
  const [authUser, setautthUser] = useState();

  useEffect(function () {
    const userDataString = localStorage.getItem("user");
    const userData = JSON.parse(userDataString);

    setautthUser(userData);
  }, []);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getAuthuserInfo"],
    queryFn: () => getOneUser(authUser),
  });

  const { data: notifications, isLoading: gettingNotifications } = useQuery({
    queryKey: ["getNotifications"],
    queryFn: async () => {
      let { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user[0].id);

      return data;
    },
  });

  if (isLoading)
    return (
      <div className="flex items-center gap-4">
        <Spinner /> loading
      </div>
    );
  return (
    <div className="p-4 w-full">
      <h1 className=" text-xl">your notifications, {user[0].firstName}</h1>
      {gettingNotifications && <p>getting notifications ...</p>}
      <div className="flex flex-col p-4 divide-y  w-full border ">
        {notifications?.length === 0 ? (
          <p className="text-sm  font-medium">there is no notifications yet </p>
        ) : (
          notifications?.map((el) => (
            <div key={el.id} className="flex gap-4 p-2 md:gap-10">
              <div>
                <p>{el.content}</p>
                <p className="text-xs ">
                  {formatDistanceToNow(new Date(el.created_at), {
                    addSuffix: true,
                    includeSeconds: true,
                  })}
                </p>
              </div>
              <Button className="border border-red-600 p-2  bg-red-50 hover:bg-red-200 transition-all duration-200 text-red-600 ">
                <Trash />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
