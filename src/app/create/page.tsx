"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { IoMdSettings } from "react-icons/io";
import { Post } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useMyContext } from "../context/PixelCrafterContext";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import loading from "./loading";

const formSchema = z.object({
  prompt: z.string().min(7, { message: "prompt must be 7 characters long!" }),
  model: z.string().optional(),
});

const Page = () => {
  const { isDarkMode } = useMyContext();
  const [outputImg, setOutputImg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isShowOverlay, setIsShowOverlay] = useState<boolean>(false);
  // const [selectedModel, setSelectedModel] = useState<string>("flux");

  //Model options
  // const modelOptions = [
  //   "flux",
  //   "flux-realism",
  //   "flux-cablyai",
  //   "flux-anime",
  //   "flux-3d",
  //   "any-dark",
  //   "flux-pro",
  //   "turbo",
  // ];

  // const handleSelectModel = (model: string) => {
  //   setSelectedModel(model);
  // };

  const fetchPosts = async () => {
    try {
      // setIsLoading(true);
      const response = await fetch("/api/image");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.log(error);
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      // model: selectedModel,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          // model: selectedModel
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setOutputImg(data.url);
        await fetchPosts();
      } else {
        console.log(data.error);
        toast({ variant: "destructive", description: data.error });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const skeletonBaseColor = isDarkMode == "dark" ? "#333333" : "#e0e0e0"; // Dark mode base color
  const skeletonHighlightColor = isDarkMode == "dark" ? "#444444" : "#f5f5f5"; // Dark mode highlight color

  return (
    <div className="h-full w-full lg:mt-[80px] mt-[90px] flex justify-center items-start flex-col p-6 relative">
      <div className="w-full py-2">
        <h1 className="font-bold text-4xl text-center">Craft Your Ideas!</h1>
        <p className="text-center dark:text-white/60 text-gray-500 my-1">
          Bring your ideas to life with AI-driven image creation, free of
          charge!
        </p>
      </div>
      <div className="w-full h-full flex-col justify-center items-center gap-3">
        <div className="__form flex-[2] flex flex-col justify-center items-center gap-2 my-5">
          <p className="text-center w-full dark:text-white/85 text-gray-800 text-sm">
            Type your idea and let AI craft the perfect image for you!
          </p>
          <div className="w-full gap-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full sm:flex  justify-center items-start gap-2 "
              >
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <div className="lg:max-w-[50%] w-[100%] flex flex-col justify-center items-center ">
                      <FormItem className="w-full h-12 lg:max-w-[100%] rounded-md  dark:border-none  flex justify-center items-center">
                        <FormControl>
                          <Input
                            placeholder="Ever imagined a city underwater? Create it here!"
                            className="w-full h-full transition-all dark:border-gray-400 border border-gray-500  text-gray-900 outline-none bg-white"
                            {...field}
                          />
                        </FormControl>
                        <div className="flex justify-center items-center h-full w-auto pb-2 px-2">
                          {" "}
                          <IoMdSettings
                            size={30}
                            className="hover:animate-spin-once cursor-pointer dark:text-gray-300 dark:hover:text-gray-200 transition-all"
                          />
                        </div>
                      </FormItem>
                      <FormMessage className="text-red-500/90  float-left w-full" />
                    </div>
                  )}
                />
                {isLoading ? (
                  <Button
                    loading={isLoading}
                    type="submit"
                    className="sm:w-auto w-full sm:m-0 my-2 px-8 py-6 font-medium bg-orange-400 text-white"
                  >
                    Generating...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="sm:w-auto w-full sm:m-0 my-2 px-8 py-6 font-medium bg-orange-400/70 hover:bg-orange-400 text-white"
                  >
                    Generate
                  </Button>
                )}
              </form>
            </Form>
          </div>

          {/* <DropdownMenu>
            <DropdownMenuTrigger>Select Model</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Models</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {modelOptions.map((model) => (
                <DropdownMenuItem
                  key={model}
                  onClick={() => handleSelectModel(model)}
                >
                  {model}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>

            <p className="mt-2">Selected Model: {selectedModel}</p>
          </DropdownMenu> */}
        </div>
        <div className="__output flex-[1] xl:flex justify-between items-start dark:bg-white/5 bg-gray-100 rounded-lg relative xl:h-[700px] h-auto p-5">
          {!outputImg ? (
            <>
              {!isLoading ? (
                <div className="w-full h-[700px] flex justify-center items-center dark:text-white/70 text-gray-500 p-3">
                  Enter your prompt and hit generate!
                </div>
              ) : (
                <div className="relative w-full h-[700px] flex justify-center items-center">
                  {/* Skeleton */}
                  <Skeleton
                    width="100%"
                    height="100%"
                    baseColor={skeletonBaseColor}
                    highlightColor={skeletonHighlightColor}
                    className="absolute top-0 left-0 z-10"
                  />

                  {/* Generating text */}
                  <span className="relative z-20 text-lg font-medium text-gray-600 dark:text-white">
                    Generating...
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              {" "}
              <div className="__Main_output relative xl:w-[38%] xl:h-full h-[500px] rounded-xl overflow-hidden ">
                <Image
                  src={outputImg ? outputImg : ""}
                  alt="result"
                  className="object-contain"
                  fill
                  sizes="100vw"
                />
              </div>
              <div className="__prev_output xl:w-[60%] xl:m-0 mt-5">
                {posts?.length > 0 ? (
                  <div className="w-full h-auto rounded-lg grid grid-cols-3 place-items-start gap-3 ">
                    {" "}
                    <AnimatePresence mode="wait">
                      {posts?.slice(0, 6)?.map((post, index) => {
                        return (
                          <motion.div
                            initial={{
                              opacity: 0,
                              scale: 0.9,
                              filter: "blur(10px)",
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              filter: "blur(0px)",
                            }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            key={post.id}
                            className=" rounded-lg w-[100%] h-full p-2 m-0 "
                          >
                            <div className="relative h-full w-full ">
                              {" "}
                              <Image
                                src={post.url}
                                alt={post.prompt}
                                height={450}
                                width={450}
                                className="object-cover h-full w-full rounded-md "
                              />
                            </div>
                            <div className="text-gray-500 flex justify-end items-center w-auto">
                              {" "}
                              <span className="border dark:border-gray-800 dark:bg-gray-900 bg-gray-100  px-1 rounded-md text-xs">
                                {new Date(post.createdAt).toLocaleDateString(
                                  "en-CA"
                                )}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="w-full h-[500px] flex justify-center items-center text-white/70">
                    No recent history!
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isShowOverlay && (
        <div className="absolute h-full w-1/2 bg-white opacity-50 top-0 right-0 z-10"></div>
      )}
    </div>
  );
};
export default Page;
