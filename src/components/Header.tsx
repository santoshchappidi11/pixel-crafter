"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BiLoaderCircle } from "react-icons/bi";
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";
import { useMyContext } from "@/app/context/PixelCrafterContext";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { IoMdSettings } from "react-icons/io";
import { MdHistory } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

const Header = () => {
  const { setIsDarkMode } = useMyContext();
  const { data: session, status } = useSession();
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    if (status !== "loading") {
      setInitialLoading(false);
    }
  }, [status, session]);

  // Handle theme toggle
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme); // Persist theme in localStorage
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    // Load theme from localStorage
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      setIsDarkMode(storedTheme);
      if (storedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [setIsDarkMode]);

  return (
    <div className="fixed top-0 w-full h-[60px] bg-gray-100 dark:bg-black/90 border-b border-white/25 p-3 flex justify-between items-center z-50">
      <Link href="/">
        <h2 className="font-semibold text-xl px-2 text-pretty">
          Pixel Crafter
        </h2>
      </Link>

      <div className="flex justify-center items-center gap-3">
        <button
          onClick={toggleTheme}
          className="py-2 px-3 bg-gray-200 dark:bg-gray-800 rounded-md"
        >
          {theme === "light" ? <IoMoonOutline /> : <IoSunnyOutline />}
        </button>
        {initialLoading && status === "loading" ? (
          <div className="pr-10">
            {" "}
            <BiLoaderCircle className="animate-spin" />
          </div>
        ) : !session ? (
          <div className="__menu">
            <Button onClick={() => signIn("google")}>Login</Button>
          </div>
        ) : (
          <>
            {" "}
            <Button onClick={() => signOut()} variant="destructive">
              Logout
            </Button>
            <Link href="/profile">
              <Avatar>
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>{" "}
            <div>
              <HoverCard>
                <HoverCardTrigger>
                  <IoMdSettings
                    size={30}
                    className="hover:animate-spin-once cursor-pointer dark:text-gray-300 dark:hover:text-white transition-all"
                  />
                </HoverCardTrigger>

                <HoverCardContent>
                  <div className="flex flex-col space-y-2 justify-start items-center w-full">
                    <Link
                      href="/history"
                      className="dark:hover:bg-gray-900 hover:bg-gray-100 p-2 rounded-md flex justify-start items-center w-full"
                    >
                      <MdHistory className="mx-2" size={20} />
                      History
                    </Link>
                    <Link
                      href="/profile"
                      className="dark:hover:bg-gray-900 hover:bg-gray-100  p-2 rounded-md flex justify-start items-center w-full"
                    >
                      <CgProfile className="mx-2" size={18} />
                      Your Profile
                    </Link>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
