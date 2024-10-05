"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
// import loading from "./loading";

const formSchema = z.object({
  prompt: z.string().min(7, { message: "prompt must be 7 characters long!" }),
});

const Page = () => {
  const [outputImg, setOutputImg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [inputPrompt, setInputPrompt] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await response.json();
      console.log(data.url);
      setOutputImg(data.url);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-dvh w-full mt-[60px] flex justify-center items-start flex-col border border-red-600">
      <div className="w-full border border-white py-2">
        <h1 className="font-bold text-4xl text-center">Create</h1>
        <p className="text-center text-white/60 my-1">
          Generate stunning images from Text for FREE
        </p>
      </div>
      <div className="w-full h-full flex gap-3 border border-blue-500 ">
        <div className="__form flex-[2] flex flex-col justify-center items-start gap-2 border border-yellow-400">
          <p className="text-left text-white/80 text-sm">
            Type your prompt here to create any image you can imagine!
          </p>
          <div className="w-full flex gap-2 ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex gap-2"
              >
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-[70%]">
                      <FormControl>
                        <Input
                          placeholder="a cat sitting on the sofa..."
                          className="w-full transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button loading={isLoading} type="submit">
                  Generate
                </Button>
              </form>
            </Form>
          </div>
        </div>
        <div className="__output flex-[1] bg-white/5 rounded-lg relative overflow-hidden border border-violet-500">
          {outputImg ? (
            <Image
              src={outputImg}
              alt="result"
              className="w-full h-full object-contain"
              height={300}
              width={300}
            />
          ) : (
            <div className="h-full w-full flex justify-center items-center text-white/70 p-3">
              Enter your prompt and hit generate!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Page;
