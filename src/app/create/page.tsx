"use client";

import { modelsData } from "@/data/data";
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
import Image, { StaticImageData } from "next/image";
import { useToast } from "@/hooks/use-toast";
import { IoMdSettings } from "react-icons/io";
import { Post } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useMyContext } from "../context/PixelCrafterContext";
import { FaArrowLeft } from "react-icons/fa6";

interface Model {
  id: number;
  title: string;
  image: StaticImageData;
  description: string;
}

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
  const [selectedModel, setSelectedModel] = useState<string>("flux");
  const [selectedModelColor, setSelectedModelColor] = useState<string | null>(
    null
  );
  const [userSearchedModel, setUserSearchedModel] = useState<string>("");
  const [filteredModelsData, setFilteredModelsData] = useState<Model[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/image");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.log(error);
    } finally {
      // setIsLoading(false);
    }
  };

  const handleSearchModelPrompt = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserSearchedModel(e.target.value);
  };

  useEffect(() => {
    if (userSearchedModel !== "") {
      const finalModel = modelsData.filter((model) =>
        model?.title?.toLowerCase()?.includes(userSearchedModel.toLowerCase())
      );

      setFilteredModelsData(finalModel);
    } else {
      setFilteredModelsData(modelsData);
    }
  }, [userSearchedModel]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenSetting = () => {
    setIsShowOverlay(true);
  };

  const handleCloseSetting = () => {
    setIsShowOverlay(false);
    setFilteredModelsData(modelsData);
  };

  const handleSelectedModel = (modelName: string) => {
    const modifiedModel = modelName.toLowerCase();
    setSelectedModel(modifiedModel);
    setSelectedModelColor(modelName);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      model: selectedModel,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          model: selectedModel,
        }),
      });
      console.log(response, "response here");
      const data = await response.json();
      console.log(data, "data here");
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
                            onClick={handleOpenSetting}
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
        </div>
        <div className="__output flex-[1] xl:flex justify-between items-center dark:bg-white/5 bg-gray-100 rounded-lg relative xl:h-[650px] h-auto p-5">
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
                                className="object-cover h-full w-full rounded-md"
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
        <div className="absolute h-full xl:w-1/2 dark:bg-black bg-gray-50/90 xl:top-[-20px] top-[-30px] right-0 z-10  overflow-y-auto custom-scrollbar">
          <div className="__exit_arrow  mt-[20px] px-5">
            <FaArrowLeft
              className="cursor-pointer dark:text-white my-5"
              size={20}
              onClick={handleCloseSetting}
            />

            <Input
              placeholder="Search Model Name..."
              className="w-full h-9 transition-all dark:border-gray-400 border border-gray-500  text-gray-900 outline-none bg-white"
              onChange={handleSearchModelPrompt}
            />
          </div>
          <div className="__Models w-full h-auto rounded-lg grid xl:grid-cols-3 grid-cols-[repeat(auto-fill,minmax(250px,1fr))] place-items-start gap-3 p-5">
            {filteredModelsData?.length ? (
              <AnimatePresence mode="wait">
                {filteredModelsData.map((model, index) => {
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
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => handleSelectedModel(model.title)}
                      key={model.id}
                      className={`h-auto w-full cursor-pointer p-2 rounded-lg border dark:border-gray-700 border-gray-400 ${
                        selectedModelColor == model.title
                          ? "border-4 dark:border-blue-500 border-blue-700"
                          : "dark:border-gray-700 border-gray-400"
                      }`}
                    >
                      <div>
                        <Image
                          src={model.image}
                          alt={model.title}
                          height={350}
                          width={350}
                          className="h-full w-full object-cover rounded-lg border"
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold dark:text-gray-300">
                          {model.title.replace(/-/g, " ")}
                        </h2>
                        <p className="text-xs font-normal dark:text-gray-400 text-gray-600">
                          {model.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Page;
