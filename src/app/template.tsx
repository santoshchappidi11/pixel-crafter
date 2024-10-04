"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const Template = ({ children }: { children: ReactNode }) => {
  const path = usePathname();

  return (
    <motion.div
      key={path}
      initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default Template;
