import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";

interface Model {
  id: number;
  title: string;
  image: StaticImageData;
  description: string;
}

interface handleModelsProps {
  isShowModelOverlay: boolean;
  handleCloseSetting: () => void;
  handleSearchModelPrompt: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filteredModelsData: Model[];
  handleSelectedModel: (model: Model) => void;
  selectedModelColor: string;
}

const Models: React.FC<handleModelsProps> = ({
  isShowModelOverlay,
  handleCloseSetting,
  handleSearchModelPrompt,
  filteredModelsData,
  handleSelectedModel,
  selectedModelColor,
}) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3 }}
      className={`${
        isShowModelOverlay ? "overflow-hidden" : "overflow-auto"
      } fixed h-full w-full dark:bg-black bg-gray-50 xl:top-[-20px] top-[-30px] right-0 z-10 overflow-y-auto custom-scrollbar`}
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
                    selectedModelColor == model.title.toLowerCase() &&
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
  );
};

export default Models;
