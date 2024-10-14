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
import { FaDownload } from "react-icons/fa";

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
  const { isDarkMode } = useMyContext();
  const [outputImg, setOutputImg] = useState<postDetailsModel>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isShwoModelOverlay, setIsShowModelOverlay] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<Model>();
  const [selectedModelColor, setSelectedModelColor] = useState<string>("flux");
  const [generatedImageModel, setGeneratedImageModel] = useState<Model>();
  const [isShowDescriptionOverlay, setIsShowDescriptionOverlay] =
    useState<boolean>(false);
  const [postDetailsData, setPostDetailsData] = useState<postDetailsModel>();
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
    if (isShwoModelOverlay) {
      // Adding class to hide horizontal overflow when the overlay opens
      document.body.classList.add("overflow-x-hidden");
    } else {
      // Wait for the closing animation to finish before removing the class
      const timer = setTimeout(() => {
        document.body.classList.remove("overflow-x-hidden");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isShwoModelOverlay]);

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
    setIsShowModelOverlay(true);
  };

  const handleCloseSetting = () => {
    setIsShowModelOverlay(false);
    setIsShowDescriptionOverlay(false);
    setFilteredModelsData(modelsData);
  };

  const handleSelectedModel = (modelName: Model) => {
    setSelectedModel(modelName);
    setSelectedModelColor(modelName.title);
  };

  const handleImageDetails = (postId: string) => {
    setIsShowDescriptionOverlay(true);

    const postDetails = posts?.find((post) => post.id === postId);
    setPostDetailsData(postDetails);

    const modelDetails = modelsData.find(
      (model) => model?.title.toLowerCase() === outputImg?.modelName
    );
    console.log(outputImg, "output image here");
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
      console.log(data, "data here");
      if (response.status === 200) {
        setOutputImg(data.post);
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
    <div className="h-full w-full lg:mt-[80px] mt-[90px] flex justify-center items-start flex-col p-6 relative ">
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
                    className="sm:w-auto w-full sm:m-0 my-2 px-8 py-6 font-medium bg-purple-500 text-white"
                  >
                    Generating...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="sm:w-auto w-full sm:m-0 my-2 px-8 py-6 font-medium bg-purple-500/80 hover:bg-purple-500 text-white"
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
              <div className="__Main_output relative xl:w-[38%] xl:h-full h-[500px] rounded-xl overflow-hidden">
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
                                className="object-cover h-full w-full rounded-md"
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
        {isShwoModelOverlay && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className={`${
              isShwoModelOverlay ? "overflow-hidden" : "overflow-auto"
            } fixed h-full w-full dark:bg-black bg-gray-50/90 xl:top-[-20px] top-[-30px] right-0 z-10 overflow-y-auto custom-scrollbar`}
          >
            <div className="__exit_arrow  mt-[20px] px-5">
              <FaArrowLeft
                className="cursor-pointer dark:text-white my-5"
                size={20}
                onClick={handleCloseSetting}
              />

              <Input
                placeholder="Search Model Name..."
                className="sm:w-4/5 lg:w-1/2 h-9 m-auto transition-all placeholder:text-gray-400 dark:border-gray-400 border border-gray-500  text-gray-900 outline-none bg-white"
                onChange={handleSearchModelPrompt}
              />
            </div>
            <div className="__Models w-full h-auto rounded-lg grid xl:grid-cols-5 grid-cols-[repeat(auto-fill,minmax(250px,1fr))] place-items-start gap-3 p-5">
              {filteredModelsData?.length > 0 && (
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
                        onClick={() => handleSelectedModel(model)}
                        key={model.id}
                        className={`h-auto w-full cursor-pointer p-2 rounded-lg  border ${
                          selectedModelColor == model.title &&
                          "border-4 dark:border-blue-500 border-blue-700"
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
              )}
            </div>
            {!filteredModelsData?.length && (
              <div className="h-96 w-full flex justify-center items-center">
                Model not found!
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isShowDescriptionOverlay && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 h-full w-full dark:bg-black bg-gray-50/100 right-0 z-10 p-5"
          >
            <div className="__exit_arrow">
              <FaArrowLeft
                className="cursor-pointer dark:text-white my-5"
                size={20}
                onClick={handleCloseSetting}
              />
            </div>
            <div className="xl:h-3/4">
              {" "}
              <div className="__image_description xl:h-full h-auto w-full xl:flex justify-between items-center ">
                <div className="__left xl:w-3/5 h-full m-2">
                  <Image
                    src={postDetailsData?.url ? postDetailsData.url : ""}
                    alt={postDetailsData?.prompt ? postDetailsData.prompt : ""}
                    width={500}
                    height={500}
                    className="xl:h-full w-full object-contain rounded-lg "
                  />
                </div>
                <div className="__right xl:w-2/5 h-full ">
                  <div className="w-full my-5">
                    <h2 className="dark:text-gray-300">Prompt:</h2>
                    <p className=" py-2 px-2 rounded-md dark:bg-gray-900 bg-gray-200 ">
                      {postDetailsData?.prompt}
                    </p>
                  </div>
                  <div className="w-full my-5">
                    <h2 className="dark:text-gray-300">Date Created:</h2>
                    <p className=" py-2 px-2 rounded-md dark:bg-gray-900 bg-gray-200 ">
                      {" "}
                      {new Date(
                        postDetailsData?.createdAt
                          ? postDetailsData.createdAt
                          : ""
                      ).toLocaleDateString("en-CA")}
                    </p>
                  </div>
                  <div className="w-full my-5">
                    <h2 className="dark:text-gray-300">Selected Model:</h2>
                    <div className="h-auto w-full dark:bg-gray-900 py-4 px-2 rounded-lg bg-gray-200 ">
                      {" "}
                      <div className="h-36 w-32">
                        <Image
                          src={
                            generatedImageModel?.image
                              ? generatedImageModel?.image
                              : ""
                          }
                          alt={
                            generatedImageModel?.title
                              ? generatedImageModel?.title
                              : ""
                          }
                          height={350}
                          width={350}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </div>
                      <div className="dark:bg-gray-900 rounded-md">
                        {" "}
                        <span className="text-2xl font-semibold">
                          {generatedImageModel?.title.replace(/-/g, " ")}
                        </span>
                        <p className="text-sm dark:text-gray-400 text-gray-600">
                          {generatedImageModel?.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3>Actions:</h3>
                    <Button>
                      <FaDownload />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Page;
