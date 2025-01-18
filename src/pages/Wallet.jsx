import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useState } from "react";
function Wallet() {
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
      <div className="flex w-full h-[100%] justify-center items-center ">
        <Spinner />
      </div>
    );
  if (error) return <p>{error}</p>;
  return (
    <div className="flex flex-col gap-4 md:p-4 p-2">
      <div className="flex w-full justify-between md:items-center">
        <h1 className="md:text-xl">
          welcome back,
          <span className="font-medium text-indigo-500">
            {user[0]?.firstName} {user[0].lastName}{" "}
          </span>
        </h1>
        <p className="text-sm  text-slate-400">{new Date().toDateString()}</p>
      </div>
      <div className="flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <Component />
      </div>
      <div className="grid auto-rows-min gap-4  md:grid-cols-2">
        <div className="aspect-video rounded-xl flex flex-col  p-2 md:p-4 bg-muted/50">
          <p>My card</p>
          <p className="">card number :{user[0]?.cardNumber}</p>
          <img
            className="w-[15rem] self-center  md:w-[30rem]"
            src="/demo-card.png"
            alt="/"
          />
        </div>
        <div className="aspect-video  rounded-xl  p-2 md:p-4 bg-muted/50 flex flex-col gap-5">
          <div className="flex w-full justify-between items-center">
            <p>Balance </p>
            <p>This month </p>
          </div>
          <h1>{formatCurrency(user[0]?.balance)}</h1>
          <div className="flex items-center justify-between">
            <div className=" text-green-400 flex flex-col items-center">
              <TrendingUp />
              <span>Incomes</span>
              <span className="font-medium md:text-xl">
                {formatCurrency(200)}
              </span>
            </div>
            <div className=" text-red-500 flex flex-col items-center">
              <TrendingDown />
              <span>Expenes</span>
              <span className="font-medium md:text-xl">
                {formatCurrency(150)}
              </span>
            </div>
          </div>
        </div>
        <div className="aspect-video rounded-xl  p-2 md:p-4 bg-muted/50">
          <div className="flex items-center justify-between">
            <span>Monthly Summary</span>
            <Link
              className="text-indigo-500  text-xs md:text-sm"
              to="/app/statistics"
            >
              see more statistics &rarr;
            </Link>
          </div>
          <div>some charts</div>
        </div>
        <div className="aspect-video rounded-xl p-2 md:p-4  bg-muted/50">
          <div className="flex  items-center justify-between">
            <span>Latest transactions</span>
            <Link
              className="text-indigo-500 text-xs md:text-sm"
              to="/app/history"
            >
              see more &rarr;
            </Link>
          </div>
          <div className="grid grid-rows-3 w-full divide-y">
            <div>name + amount + date + reason</div>
            <div>name + amount + date + reason</div>
            <div>name + amount + date + reason</div>
          </div>
        </div>
      </div>
      {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
    </div>
  );
}

export default Wallet;

import * as React from "react";
import {
  ArrowBigDown,
  ArrowUpNarrowWide,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getOneUser, getUsers } from "../services/apiUsers";
import Spinner from "../components/ui/spinner";
import { data, Link, NavLink, useNavigate } from "react-router-dom";
import supabase from "../services/supabase/supabase";
import { formatCurrency } from "../utils/helpers";
import { date } from "zod";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
};

function Component() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
