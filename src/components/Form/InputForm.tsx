import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as article from "@/lib/api/article";
import type { ArticleTest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { formSchema } from "../../schema/ZodValidationtest";
import CustomDropZone from "../ui/CustomDropZone";
import CustomSelect from "../ui/CustomSelect";
import { AutoResizeTextarea } from "../ui/autoresizetextarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useAutosizeTextArea from "../useAutosizeTextArea";

export function InputForm() {
  const [value, setValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, value);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(evt.target?.value);
  };

  const form = useForm<ArticleTest>({
    defaultValues: {
      title: "",
      category: "",
      description: "",
    },
    resolver: zodResolver(formSchema),
  });

  // const { data, isError, isLoading } = useQuery({
  //   queryKey: ["article"],
  //   queryFn: () => article.get(),
  // });

  const data = [
    {
      id: 1,
      title: "Prisma Adds Support for MongoDB",
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
    },
    {
      id: 2,
      title: "What's new in Prisma? (Q1/22)",
      description:
        "Learn about everything in the Prisma ecosystem and community from January to March 2022.",
    },
    {
      id: 3,
      title: "Introducing Prisma Migrate",
      description:
        "Discover the latest addition to the Prisma toolset, empowering developers to evolve their database schema effortlessly.",
    },
    {
      id: 4,
      title: "Scaling Your App with Prisma Client",
      description:
        "Explore strategies and best practices for optimizing performance and scalability when using Prisma Client in your application.",
    },
  ];

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return article.create(formData);
    },
    onSuccess: () => {
      alert("Article created");
    },
  });

  const onSubmit: SubmitHandler<ArticleTest> = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    mutation.mutate(formData);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Your Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem {...field}>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <AutoResizeTextarea
                    onChange={handleChange}
                    placeholder="Your Description"
                    ref={textAreaRef}
                    rows={3}
                    value={value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem {...field}>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CustomDropZone />

          {data && <CustomSelect options={data} />}

          <Button className="w-full py-6 text-base" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
