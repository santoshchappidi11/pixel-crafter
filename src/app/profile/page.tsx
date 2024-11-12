"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";

const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  useEffect(() => {
    if (session?.user) {
      setIsLoading(false);
    }
  }, [session]);

  return (
    <>
      {isLoading ? (
        <div className="mt-[72px] h-dvh w-full flex justify-center items-center">
          {" "}
          <BiLoaderCircle className="animate-spin" />
        </div>
      ) : (
        <div className="mt-[72px] h-dvh w-full flex justify-center items-start">
          <div
            style={{
              boxShadow: "0 1px 10px 1px rgba(139, 92, 246, 0.3)",
            }}
            className=" w-auto flex justify-center items-center flex-col mt-16 p-5   dark:bg-violet-900/10 bg-gray-100/50 rounded-lg"
          >
            {" "}
            <div className="__Main_Profile_Image">
              {" "}
              <Avatar className="h-20 w-20  my-10">
                <AvatarImage
                  src={session?.user?.image || ""}
                  className="h-full w-full"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="__Profile_Details w-auto px-5">
              <div className="grid sm:grid-cols-2 gap-4 my-8 sm:text-left text-center">
                <label className="dark:text-gray-400 text-gray-500 sm:justify-start justify-center">
                  Email:
                </label>
                <p className="sm:justify-start justify-center">
                  {session?.user?.email ? session?.user?.email : "NA"}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 my-8 sm:text-left text-center">
                <label className="dark:text-gray-400 text-gray-500 sm:justify-start justify-center">
                  Name:
                </label>
                <p className="sm:justify-start justify-center">
                  {session?.user?.name ? session?.user?.name : "NA"}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 my-8 sm:text-left text-center">
                <label className="dark:text-gray-400 text-gray-500 sm:justify-start justify-center">
                  Account Created:
                </label>
                <p className="sm:justify-start justify-center">
                  {session?.user?.createdAt
                    ? new Date(session.user.createdAt).toLocaleDateString(
                        "en-CA"
                      )
                    : "NA"}
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="my-2 px-20 py-5"
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
