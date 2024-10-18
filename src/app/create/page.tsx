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
import ImageDetails from "../components/ImageDetails";
import Models from "../components/Models";
import { BsStars } from "react-icons/bs";
import { BiLoaderCircle } from "react-icons/bi";

interface Model {
  id: number;
  title: string;
  image: StaticImageData;
  description: string;
}

interface postDetailsModel {
  prompt: string;
  id: string;
  seed: number;
  url: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  modelName: string;
}

const formSchema = z.object({
  prompt: z.string().min(7, { message: "prompt must be 7 characters long!" }),
  model: z.string().optional(),
});

const Page = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [promptLoader, setPromptLoader] = useState<boolean>(false);
  const { isDarkMode } = useMyContext();
  const [outputImg, setOutputImg] = useState<postDetailsModel>();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isShowModelOverlay, setIsShowModelOverlay] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<Model>();
  const [selectedModelColor, setSelectedModelColor] = useState<string>("flux");
  const [generatedImageModel, setGeneratedImageModel] = useState<Model>();
  const [postDetailsData, setPostDetailsData] = useState<postDetailsModel>();
  const [isShowDescriptionOverlay, setIsShowDescriptionOverlay] =
    useState<boolean>(false);
  const [userSearchedModel, setUserSearchedModel] = useState<string>("");
  const [filteredModelsData, setFilteredModelsData] = useState<Model[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/image");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchModelPrompt = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserSearchedModel(e.target.value);
  };

  useEffect(() => {
    if (isShowModelOverlay) {
      // Adding class to hide horizontal overflow when the overlay opens
      document.body.classList.add("overflow-x-hidden");
    } else {
      // Wait for the closing animation to finish before removing the class
      const timer = setTimeout(() => {
        document.body.classList.remove("overflow-x-hidden");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isShowModelOverlay]);

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

  useEffect(() => {
    setSelectedModelColor("flux");
  }, []);

  const handleOpenSetting = () => {
    setIsShowModelOverlay(true);
  };

  const handleCloseSetting = () => {
    setIsShowModelOverlay(false);
    setIsShowDescriptionOverlay(false);
    setFilteredModelsData(modelsData);
  };

  const handleSelectedModel = (modelName: Model) => {
    setSelectedModel(modelName);
    setSelectedModelColor(modelName.title.toLowerCase());
  };

  const handleImageDetails = (postId: string) => {
    setIsShowDescriptionOverlay(true);

    const postDetails = posts?.find((post) => post.id === postId);
    setPostDetailsData(postDetails);

    const modelDetails = modelsData.find(
      (model) => model?.title.toLowerCase() === outputImg?.modelName
    );

    setGeneratedImageModel(modelDetails);
  };

  const handleHistoryImageDetails = (historyPost: postDetailsModel) => {
    setIsShowDescriptionOverlay(true);

    const postDetails = posts?.find((post) => post.id === historyPost.id);
    setPostDetailsData(postDetails);

    const modelDetails = modelsData.find(
      (model) => model?.title.toLowerCase() === historyPost.modelName
    );

    setGeneratedImageModel(modelDetails);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      model: selectedModel?.title.toLowerCase(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          model: selectedModel?.title.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setOutputImg(data.post);
        await fetchPosts();
      } else {
        toast({ variant: "destructive", description: data.error });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handlePromptEnhancement = async (prompt: string) => {
    if (prompt.length) {
      try {
        setPromptLoader(true);
        const response = await fetch("/api/text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
          }),
        });

        const data = await response.json();
        if (response.status === 200) {
          form.setValue("prompt", data.text, { shouldValidate: true });
        } else {
          toast({ variant: "destructive", description: data.error });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setPromptLoader(false);
      }
    } else {
      toast({
        variant: "destructive",
        description: "Please enter something to do the magic! ✨",
      });
    }
  };

  const skeletonBaseColor = isDarkMode == "dark" ? "#333333" : "#e0e0e0"; // Dark mode base color
  const skeletonHighlightColor = isDarkMode == "dark" ? "#444444" : "#f5f5f5"; // Dark mode highlight color

  return (
    <div className="h-full w-full pt-28  flex justify-center items-start flex-col p-6 relative dark:bg-gradient-to-r from-transparent via-violet-800/40 to-transparent">
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
                      <FormItem
                        style={{
                          boxShadow: "0 1px 12px 2px rgba(139, 92, 246, 0.5)",
                        }}
                        className=" border-2 dark:border-violet-500 border-gray-900 bg-white w-full h-12 lg:max-w-[100%] rounded-md  dark:border-none  flex justify-center items-center"
                      >
                        <FormControl>
                          <Input
                            placeholder="Ever imagined a city underwater? Create it here!"
                            className="w-full h-full transition-all text-gray-900 outline-none bg-white"
                            {...field}
                          />
                        </FormControl>
                        <div className="flex justify-center items-center h-full w-auto pb-2 px-2">
                          {promptLoader ? (
                            <>
                              <BiLoaderCircle className="animate-spin text-yellow-500 mr-1" />
                            </>
                          ) : (
                            <BsStars
                              size={25}
                              className={`  ${
                                isLoading
                                  ? "pointer-events-none text-gray-300"
                                  : "pointer-events-auto text-gray-900"
                              } cursor-pointer hover:text-yellow-500 transition-all`}
                              onClick={() =>
                                handlePromptEnhancement(field.value)
                              }
                            />
                          )}

                          <IoMdSettings
                            onClick={handleOpenSetting}
                            size={30}
                            className={` ${
                              isLoading
                                ? "pointer-events-none text-gray-300"
                                : "pointer-events-auto text-gray-900"
                            } hover:animate-spin-once cursor-pointer transition-all`}
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
                    className="sm:w-auto w-full sm:m-0 my-2 px-8 py-6 font-medium  bg-violet-800 text-white hover:bg-violet-700 tracking-widest"
                  >
                    Generating...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="relative sm:w-auto w-full sm:m-0 my-2 px-8 py-6 font-medium  bg-violet-800 text-white hover:bg-violet-700 tracking-widest overflow-hidden group"
                  >
                    Generate
                    {/* Shine effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform translate-x-[-150%] transition-all duration-500 ease-in-out group-hover:translate-x-[150%]"></span>
                  </Button>
                )}
              </form>
            </Form>
          </div>
        </div>
        <div className="__output flex-[1] xl:flex justify-between items-center dark:bg-gray-900 bg-gray-100 rounded-lg relative xl:h-[650px] h-auto p-5">
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
                  src={outputImg?.url ? outputImg?.url : ""}
                  alt="result"
                  className="object-contain cursor-pointer"
                  fill
                  sizes="100vw"
                  onClick={() => handleImageDetails(outputImg?.id)}
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
                                className="object-cover h-full w-full rounded-md cursor-pointer"
                                onClick={() => handleHistoryImageDetails(post)}
                              />
                            </div>
                            <div className="text-gray-500 flex justify-end items-center w-auto">
                              {" "}
                              <span className="border dark:border-gray-800 dark:bg-gray-900 bg-gray-100  px-2 rounded-md text-xs">
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

      <AnimatePresence>
        {isShowModelOverlay && (
          <>
            <Models
              isShowModelOverlay={isShowModelOverlay}
              handleCloseSetting={handleCloseSetting}
              handleSearchModelPrompt={handleSearchModelPrompt}
              filteredModelsData={filteredModelsData}
              handleSelectedModel={handleSelectedModel}
              selectedModelColor={selectedModelColor}
            />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isShowDescriptionOverlay && (
          <>
            {postDetailsData && generatedImageModel && (
              <ImageDetails
                handleCloseSetting={handleCloseSetting}
                postDetailsData={postDetailsData}
                generatedImageModel={generatedImageModel}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Page;
