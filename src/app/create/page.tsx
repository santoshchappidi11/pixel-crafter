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
    <div className="h-dvh w-full lg:mt-[60px] mt-[90px] flex justify-center items-start flex-col p-5">
      <div className="w-full py-2">
        <h1 className="font-bold text-4xl text-center">Create</h1>
        <p className="text-center text-white/60 my-1">
          Generate stunning images from Text for FREE
        </p>
      </div>
      <div className="w-full h-full lg:flex gap-3">
        <div className="__form flex-[2] flex flex-col justify-center items-start gap-2 my-5">
          <p className="lg:text-left text-center w-full text-white/80 text-sm">
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
                    <FormItem className="w-full lg:max-w-[70%]">
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
        <div className="__output flex-[1] bg-white/5 rounded-lg relative overflow-hidden h-full">
          {outputImg ? (
            <Image
              src={outputImg}
              alt="result"
              className="w-full h-full object-contain"
              height={300}
              width={300}
            />
          ) : (
            <div className="h-full w-full flex justify-center items-center text-white/70 p-3 border border-white">
              Enter your prompt and hit generate!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Page;
