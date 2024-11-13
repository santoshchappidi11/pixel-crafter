"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { introBanners } from "@/data/data";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Trigger the animation after a short delay
    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 1000); // Delay of 1 second to show the images first

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  return (
    <div className="h-dvh w-full flex justify-center items-center">
      <div className="w-full flex justify-center items-center flex-col mt-20">
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
          className="dark:text-white/60 text-gray-500 w-full text-center text-wrap sm:px-0 px-5"
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
            <Button className="relative mt-5 py-7 px-8 text-base font-semibold bg-violet-800 hover:bg-violet-700 text-white overflow-hidden group">
              Start Crafting <FaArrowRight className="ml-2" />
              {/* Shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform translate-x-[-150%] transition-all duration-500 ease-in-out group-hover:translate-x-[150%]"></span>
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="mt-10 w-full overflow-hidden relative"
        >
          <div
            className={`banner-wrapper flex add-transition ${
              hasLoaded ? "animate-slide" : ""
            }`}
          >
            {/* Original set of banners */}
            {introBanners?.length &&
              introBanners.map((banner, i) => (
                <div key={i} className="relative h-52 w-60 flex-shrink-0">
                  <Image src={banner} alt="banner" height={500} width={500} />
                  {/* Black overlay */}
                  <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 hover:opacity-0"></div>
                </div>
              ))}

            {/* Duplicated set of banners for seamless loop */}
            {introBanners?.length &&
              introBanners.map((banner, i) => (
                <div key={i} className="relative h-52 w-60 flex-shrink-0">
                  <Image src={banner} alt="banner" height={500} width={500} />
                  {/* Black overlay */}
                  <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 hover:opacity-0"></div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
