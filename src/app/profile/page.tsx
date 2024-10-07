"use client";

import { Post } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";

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

  return (
    <div className="min-h-dvh w-full p-3 pt-[72px] grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] auto-rows-min gap-3 ">
      {isLoading ? (
        <div className="col-span-full w-full flex justify-center items-center">
          {" "}
          <BiLoaderCircle className="animate-spin" />
        </div>
      ) : (
        <>
          {posts?.length ? (
            <AnimatePresence mode="wait">
              {posts.map((post, index) => {
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    key={post.id}
                    className="border rounded-lg w-full h-auto p-2"
                  >
                    <Image
                      src={post.url}
                      alt={post.prompt}
                      height={250}
                      width={250}
                      className="object-cover w-full rounded-md"
                    />
                    <p className="dark:text-white/70 text-gray-600 text-center pt-2">
                      {post.prompt}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            <div className="col-span-full flex justify-center items-center text-white/70 ">
              No history!
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
