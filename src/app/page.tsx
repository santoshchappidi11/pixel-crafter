"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  return (
    <div className="h-dvh w-full flex justify-center items-center">
      <div className="flex justify-center items-center flex-col">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-6xl font-bold uppercase"
        >
          Pixel Crafter
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="dark:text-white/60 w-full text-center text-wrap sm:px-0 px-5"
        >
          Create breathtaking images from text with cutting-edge AI technology,
          completely free.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {" "}
          <Link href="/create">
            {" "}
            <Button className="relative mt-5 py-7 px-8 text-base font-bold bg-violet-800 hover:bg-violet-700 text-white overflow-hidden group">
              Start Crafting <FaArrowRight className="ml-2" />
              {/* Shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform translate-x-[-150%] transition-all duration-500 ease-in-out group-hover:translate-x-[150%]"></span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
