import React from "react";

const page = () => {
  return (
    <div className="h-dvh w-full mt-[60px] flex justify-center items-start flex-col border border-red-600">
      <div className="w-full border border-white py-2">
        <h1 className="font-bold text-4xl text-center">Create</h1>
        <p className="text-center text-white/60 my-1">
          Generate stunning images from Text for FREE
        </p>
      </div>
      <div className="w-full h-full flex gap-3 border border-blue-500 ">
        <div className="__form flex-[2] border border-yellow-400"></div>
        <div className="__output flex-[1] border border-violet-500"></div>
      </div>
    </div>
  );
};

export default page;
