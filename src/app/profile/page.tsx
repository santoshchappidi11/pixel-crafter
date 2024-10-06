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
    <div className="min-h-dvh w-full p-3 pt-[72px] grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3 place-items-center">
      {isLoading ? (
        <div className="col-span-full flex justify-center items-center">
          {" "}
          <BiLoaderCircle className="animate-spin" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {posts.map((post, index) => {
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={post.id}
                className="border rounded-lg h-full w-full p-1"
              >
                <Image
                  src={post.url}
                  alt={post.prompt}
                  height={250}
                  width={250}
                  className="object-contain w-full rounded-md"
                />
                <p className="text-white/70">{post.prompt}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Page;
