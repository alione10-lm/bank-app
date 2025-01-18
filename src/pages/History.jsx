import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/ui/spinner";
import { useEffect, useState } from "react";
import { getOneUser } from "../services/apiUsers";

function History() {
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

  if (isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );
  return (
    <div>
      <h1>you transfers history , {user?.at(0)?.firstName}</h1>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50"></div>
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>

        <div className="  flex flex-col w-full">
          {user?.at(0).mouvements?.map((el, ndx) => (
            <div key={ndx} className="flex items-center gap-5">
              <p>{el.type}</p>
              <p>{el.amount}</p>
              <p>{el.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default History;
