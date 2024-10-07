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
import { useToast } from "@/hooks/use-toast";
// import loading from "./loading";

const formSchema = z.object({
  prompt: z.string().min(7, { message: "prompt must be 7 characters long!" }),
});

const Page = () => {
  const [outputImg, setOutputImg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [inputPrompt, setInputPrompt] = useState<string>("");

  const { toast } = useToast();

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
      if (response.status === 200) {
        setOutputImg(data.url);
      } else {
        console.log(data.error);
        toast({ variant: "destructive", description: data.error });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className=" h-full w-full lg:mt-[60px] mt-[90px] flex justify-center items-start flex-col p-5">
      <div className="w-full py-2">
        <h1 className="font-bold text-4xl text-center">Craft Your Ideas!</h1>
        <p className="text-center dark:text-white/60 text-gray-500 my-1">
          Bring your ideas to life with AI-driven image creation, free of
          charge!
        </p>
      </div>
      <div className="w-full h-full lg:flex gap-3 mt-0 lg:m-0">
        <div className="__form flex-[2] flex flex-col justify-center items-start gap-2 my-5">
          <p className="lg:text-left text-center w-full dark:text-white/85 text-gray-800 text-sm">
            Type your idea and let AI craft the perfect image for you!
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
                    <FormItem className="w-full lg:max-w-[70%]">
                      <FormControl>
                        <Input
                          placeholder="Ever imagined a city underwater? Create it here!"
                          className="w-full transition-all dark:border-white/30 border-gray-400 placeholder:text-gray-400"
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
        <div className="__output flex-[1] justify-center items-center dark:bg-white/5 bg-gray-100 rounded-lg relative overflow-hidden h-[500px] ">
          {outputImg ? (
            <Image
              src={outputImg}
              alt="result"
              className="w-full h-full object-contain "
              height={300}
              width={300}
            />
          ) : (
            <div className="w-full h-full flex justify-center items-center dark:text-white/70 text-gray-500 p-3">
              Enter your prompt and hit generate!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Page;
