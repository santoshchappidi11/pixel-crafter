"use client";

import { toast } from "@/hooks/use-toast";
import { Post } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";

const Page = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/image");
      const data = await response.json();
      console.log(data);
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

  async function handlePostDelete(postId: string) {
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
        toast({ variant: "default", description: data.message });
      } else {
        console.log(data.error);
        toast({ variant: "destructive", description: data.error });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-dvh w-full p-3 pt-[72px] flex justify-center items-center">
      {isLoading ? (
        <div className="col-span-full w-full flex justify-center items-center">
          {" "}
          <BiLoaderCircle className="animate-spin" />
        </div>
      ) : (
        <div className="h-full w-full grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3 place-items-start">
          {posts?.length > 0 ? (
            <AnimatePresence mode="wait">
              {posts.map((post, index) => {
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    key={post.id}
                    className="border rounded-lg w-full h-auto p-2 "
                  >
                    <div className="relative">
                      {" "}
                      <Image
                        src={post.url}
                        alt={post.prompt}
                        height={250}
                        width={250}
                        className="object-cover w-full rounded-md"
                      />
                      <RxCross2
                        className="absolute right-2 top-2 text-gray-900 cursor-pointer"
                        size={25}
                        onClick={() => handlePostDelete(post.id)}
                      />
                    </div>
                    <p className="dark:text-white/70 text-gray-600 text-center pt-2">
                      {post.prompt}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            <div className="w-full col-span-full flex justify-center items-center text-white/70">
              No history!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
