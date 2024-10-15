"use client";

import { toast } from "@/hooks/use-toast";
import { Post } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import CardCloseBtn from "./CardCloseBtn";
import ImageDetails from "../components/ImageDetails";
import { modelsData } from "@/data/data";
// import { RxCross2 } from "react-icons/rx";

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

const Page = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [cardHoveredId, setIsCardHoveredId] = useState<string | null>(null);
  const [isShowDescriptionOverlay, setIsShowDescriptionOverlay] =
    useState<boolean>(true);
  const [generatedImageModel, setGeneratedImageModel] = useState<Model>();
  const [postDetailsData, setPostDetailsData] = useState<postDetailsModel>();

  console.log(generatedImageModel, "model name");
  console.log(postDetailsData, "post details");
  const handleCloseSetting = () => {
    setIsShowDescriptionOverlay(false);
  };

  const handleImageDetails = (post: postDetailsModel) => {
    console.log(post, "post from above");
    setIsShowDescriptionOverlay(true);
    const modelDetails = modelsData.find(
      (model) => model?.title.toLowerCase() === post.modelName.toLowerCase()
    );

    if (modelDetails) {
      setGeneratedImageModel(modelDetails);
    }

    if (post) {
      setPostDetailsData(post);
    }
  };

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/image");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handlePostDelete(postId: string | number) {
    try {
      const response = await fetch("/api/image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        toast({ variant: "success", description: data.message });
      } else {
        console.log(data.error);
        toast({ variant: "destructive", description: data.error });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteAllPosts() {
    try {
      const response = await fetch("/api/image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteAll: true }),
      });
      const data = await response.json();

      if (response.status === 200) {
        setPosts([]);
        toast({ variant: "success", description: data.message });
      } else {
        console.log(data.error);
        toast({ variant: "destructive", description: data.error });
      }
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", description: "Something went wrong!" });
    }
  }

  return (
    <div className="pt-[72px]">
      {!isLoading && posts?.length > 0 && (
        <div className="w-full flex justify-end items-center px-3">
          <Button variant="destructive" onClick={handleDeleteAllPosts}>
            Delete All
          </Button>
        </div>
      )}
      <div className="min-h-dvh w-full p-3 flex justify-center items-center flex-col">
        {isLoading ? (
          <div className="col-span-full w-full flex justify-center items-center">
            {" "}
            <BiLoaderCircle className="animate-spin" />
          </div>
        ) : (
          <>
            {" "}
            <div className="h-full w-full grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3 place-items-start">
              {posts?.length > 0 ? (
                <AnimatePresence mode="wait">
                  {posts.map((post, index) => {
                    return (
                      <motion.div
                        initial={{
                          opacity: 0,
                          scale: 0.9,
                          filter: "blur(10px)",
                        }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        key={post.id}
                        className="border rounded-lg w-full h-auto p-2"
                        onMouseEnter={() => setIsCardHoveredId(post.id)}
                        onMouseLeave={() => setIsCardHoveredId(null)}
                      >
                        <div
                          className="relative w-full cursor-pointer"
                          onClick={() => handleImageDetails(post)} // Move the onClick event here
                        >
                          <Image
                            src={post.url}
                            alt={post.prompt}
                            height={250}
                            width={250}
                            className="object-cover w-full rounded-md"
                          />

                          {/* Image Overlay */}
                          <div
                            className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${
                              cardHoveredId === post.id
                                ? "opacity-100"
                                : "opacity-0 pointer-events-none"
                            } rounded-md`}
                          ></div>

                          {cardHoveredId == post.id && (
                            <CardCloseBtn
                              handlePostDelete={handlePostDelete}
                              postId={post.id}
                            />
                          )}
                        </div>

                        <div className="text-sm text-gray-500 flex justify-end items-center w-auto pt-2 ">
                          {" "}
                          <span className="border dark:bg-gray-900 bg-gray-100  px-1 rounded-md">
                            {new Date(post.createdAt).toLocaleDateString(
                              "en-CA"
                            )}
                          </span>
                        </div>
                        <p className="dark:text-white/60 text-gray-600 text-center py-1 px-2 text-sm text-pretty">
                          {post.prompt}
                        </p>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              ) : (
                <div className="w-full col-span-full flex justify-center items-center dark:text-white/70">
                  No history!
                </div>
              )}
            </div>
          </>
        )}
      </div>

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
