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
            <Button className="mt-5 py-6 px-5 text-base font-bold">
              Start Crafting <FaArrowRight className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
