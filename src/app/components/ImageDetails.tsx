import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";
import { FaEye } from "react-icons/fa";

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

interface handleImageDetailsProps {
  handleCloseSetting: () => void;
  postDetailsData: postDetailsModel;
  generatedImageModel: Model;
}

const ImageDetails: React.FC<handleImageDetailsProps> = ({
  handleCloseSetting,
  postDetailsData,
  generatedImageModel,
}) => {
  const handleDownload = async () => {
    const response = await fetch(postDetailsData.url);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `image-${postDetailsData.id}.jpg`;
    link.click();
    URL.revokeObjectURL(url); // Cleaning up the object URL
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 left-0 right-0 bottom-0 rounded-lg  h-screen w-full dark:bg-gray-950 bg-gray-50/100 z-10 p-5 overflow-y-auto custom-scrollbar"
    >
      <div className="__exit_arrow">
        <FaArrowLeft
          className="cursor-pointer dark:text-white my-5"
          size={20}
          onClick={handleCloseSetting}
        />
      </div>
      <div className="xl:h-3/4 h-auto">
        <div className="__image_description xl:h-full h-auto w-full xl:flex justify-between items-center">
          <div className="__left xl:w-3/5 h-full m-2">
            <Image
              src={postDetailsData?.url ? postDetailsData.url : ""}
              alt={postDetailsData?.prompt ? postDetailsData.prompt : ""}
              width={500}
              height={500}
              className="xl:h-full w-full object-contain rounded-lg"
            />
          </div>
          <div className="__right xl:w-2/5 h-full px-2 overflow-y-auto custom-scrollbar">
            <div className="w-full my-5">
              <h2 className="dark:text-gray-300">Prompt:</h2>
              <p className="py-2 px-2 rounded-md dark:bg-gray-900 bg-gray-200 text-base dark:text-gray-100">
                {postDetailsData?.prompt}
              </p>
            </div>
            <div className="w-full my-5">
              <h2 className="dark:text-gray-300">Date Created:</h2>
              <p className="py-2 px-2 rounded-md dark:bg-gray-900 bg-gray-200">
                {new Date(
                  postDetailsData?.createdAt ? postDetailsData.createdAt : ""
                ).toLocaleDateString("en-CA")}
              </p>
            </div>
            <div className="w-full my-5">
              <h2 className="dark:text-gray-300">Selected Model:</h2>
              <div className="h-auto w-full dark:bg-gray-900 py-4 px-2 rounded-lg bg-gray-200">
                <div className="h-36 w-32">
                  <Image
                    src={
                      generatedImageModel?.image
                        ? generatedImageModel?.image
                        : ""
                    }
                    alt={
                      generatedImageModel?.title
                        ? generatedImageModel?.title
                        : ""
                    }
                    height={350}
                    width={350}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <div className="dark:bg-gray-900 rounded-md">
                  <span className="text-2xl font-semibold">
                    {generatedImageModel?.title.replace(/-/g, " ")}
                  </span>
                  <p className="text-sm dark:text-gray-400 text-gray-600">
                    {generatedImageModel?.description}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3>Actions:</h3>
              <div className="w-full h-auto flex items-center">
                {" "}
                <a href={postDetailsData.url}>
                  {" "}
                  <Button className="mx-1">
                    <FaEye size={17} /> View
                  </Button>
                </a>
                <Button onClick={handleDownload} className="mx-1">
                  <FaDownload />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageDetails;
