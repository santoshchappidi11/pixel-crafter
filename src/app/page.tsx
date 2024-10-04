"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-dvh w-full flex justify-center items-center">
      <div className="flex justify-center items-center flex-col">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-6xl font-bold"
        >
          PIXEL CRAFTER
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-white/60"
        >
          Generate stunning images from text using AI models for free.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {" "}
          <Link href="/create">
            {" "}
            <Button className="mt-5 py-5 text-base font-bold">
              Start Creating
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
