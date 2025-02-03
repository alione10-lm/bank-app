import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOneUser, getUsers, ReceiverUser } from "../services/apiUsers";
import Spinner from "../components/ui/spinner";
import { useEffect, useState } from "react";

import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useForm } from "react-hook-form";
import supabase from "../services/supabase/supabase";
import { useToast } from "../hooks/use-toast";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

function Sent() {
  const [AuthUser, setAuthUser] = useState();
  const queryClient = useQueryClient();
  const [cardNumber, setCardNumber] = useState("");

  const { toast } = useToast();

  const { data: filtredUser, isLoading: isGettingsReciever } = useQuery({
    queryKey: ["filterUserByHisCardNumber", cardNumber],
    queryFn: () => ReceiverUser(cardNumber),
  });
  const { handleSubmit, register } = useForm();

  const {
    data: user,
    isLoading: gettingCurrentUser,
    error,
  } = useQuery({
    queryKey: ["getAuthuserInfo"],
    queryFn: () => getOneUser(AuthUser),
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ["getUsers"],
    queryFn: getUsers,
  });

  const { mutate: sendTo, isPending } = useMutation({
    mutationKey: "sendMoney",
    mutationFn: async (newUser) => {
      await supabase
        .from("users")
        .update(newUser)
        .eq("id", newUser.id)
        .select();
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      console.log("money transfered successfully");
      toast({
        description: "money transfered successfully",
      });
    },
  });

  const { mutate: createNotification } = useMutation({
    useMutation: ["create_notification"],
    mutationFn: async (data) => {
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
    },
  });

  const { mutate: updateSender } = useMutation({
    useMutation: ["create_notification"],
    mutationFn: async (newData) => {
      await supabase
        .from("users")
        .update(newData)
        .eq("id", AuthUser.id)
        .select();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getAuthuserInfo"]);
    },
  });

  function OnSubmit(data) {
    const userToUpdate = users
      .filter((user) => user.id === Number(data.id))
      .at(0);
    console.log(userToUpdate);
    console.log(Number(data.amount));

    const newUserData = {
      ...userToUpdate,
      balance: userToUpdate.balance + Number(data.amount),
      mouvements: [...userToUpdate.mouvements, data],
    };
    const newSenderData = {
      ...user[0],
      balance: Number(user[0].balance) - Number(data.amount),
      mouvements: [
        ...user[0].mouvements,
        {
          type: `money trasfer of ${data.amount}`,
          amount: data.amount,
        },
      ],
    };

    updateSender(newSenderData);
    console.log(newUserData);
    sendTo(newUserData);
    createNotification(data);
  }

  useEffect(function () {
    const userDataString = localStorage.getItem("user");
    const userData = JSON.parse(userDataString);
    setAuthUser(userData);
  }, []);

  if (gettingCurrentUser)
    return (
      <div className="flex w-full h-[100%] justify-center items-center ">
        <Spinner />
      </div>
    );

  return (
    <div className="w-full md:p-4 p-2">
      <h1 className="mb-10">quik money transfer to : 76122562 , </h1>
      <div>
        <Input
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="find a receiver"
          className="w-[50%] mb-8 md:mb-16"
        />
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="">avatar</TableHead>
              <TableHead className="truncate max-w-20 md:w-[40%]  ">
                email
              </TableHead>
              <TableHead>card number</TableHead>
              <TableHead className="text-right">action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isGettingsReciever && filtredUser?.length === 0 && (
              <p className="w-full text-center">user not found</p>
            )}
            {isGettingsReciever ? (
              <div className=" w-full flex items-center justify-center">
                searching...
              </div>
            ) : (
              filtredUser?.map(
                (user) =>
                  AuthUser?.cardNumber !== user.cardNumber && (
                    <TableRow key={user.id}>
                      <TableCell className="">
                        <Avatar>
                          <AvatarFallback>ab</AvatarFallback>
                          <AvatarImage
                            className="md:w-16 w-8 rounded-md"
                            src={user.avatar}
                          />
                        </Avatar>
                      </TableCell>
                      <TableCell className="truncate max-w-20 md:w-[40%] ">
                        {user.email}
                      </TableCell>
                      <TableCell>{user.cardNumber}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">send</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>
                                transfer money to {user.firstName}
                              </DialogTitle>
                              <DialogDescription />
                            </DialogHeader>
                            <form action="" onSubmit={handleSubmit(OnSubmit)}>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="amount"
                                    className="text-right"
                                  >
                                    Amount
                                  </Label>
                                  <Input
                                    id="name"
                                    {...register("amount")}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="reason"
                                    className="text-right"
                                  >
                                    Reason
                                  </Label>
                                  <Input
                                    id="reason"
                                    {...register("reason")}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Input
                                    id="reason"
                                    type="hidden"
                                    value={user.id}
                                    className="col-span-3"
                                    {...register("id")}
                                  />
                                  <Input
                                    id="reason"
                                    type="hidden"
                                    value={user.firstName}
                                    className="col-span-3"
                                    {...register("username")}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit">
                                  {isPending
                                    ? "transfering ..."
                                    : "confirm transfer"}
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  )
              )
            )}
          </TableBody>
        </Table>
      </div>
      {/* <div className="w-fit flex flex-col ">
        {users?.map(
          (user) =>
            AuthUser?.id !== user?.id && (
              <div key={user.id} className="flex gap-3 ">
                <Avatar>
                  <AvatarImage
                    src={user.avatar}
                    alt="@shadcn"
                    className="w-10 rounded-full"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col col-span-2">
                  <p>{user.firstName}</p>
                  <p className="text-xs">{user.email}</p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">send</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        transfer money to {user.firstName}
                      </DialogTitle>
                      <DialogDescription />
                    </DialogHeader>
                    <form action="" onSubmit={handleSubmit(OnSubmit)}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            Amount
                          </Label>
                          <Input
                            id="name"
                            {...register("amount")}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="reason" className="text-right">
                            Reason
                          </Label>
                          <Input
                            id="reason"
                            {...register("reason")}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Input
                            id="reason"
                            type="hidden"
                            value={user.id}
                            className="col-span-3"
                            {...register("id")}
                          />
                          <Input
                            id="reason"
                            type="hidden"
                            value={user.firstName}
                            className="col-span-3"
                            {...register("username")}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">
                          {isPending ? "transfering ..." : "confirm transfer"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            )
        )}
      </div> */}
    </div>
  );
}

export default Sent;
