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
import { useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";

import { formSchema } from "../../schema/ZodValidationtest";
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
    const val = evt.target?.value;

    setValue(val);
  };

  const form = useForm<ArticleTest>({
    defaultValues: {
      title: "",
      category: "",
      description: "",
    },
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: ArticleTest) => {
      console.log(`Data ${JSON.stringify(data)}`);
      return article.create(data);
    },
    onSuccess: () => {
      alert("Article created");
    },
  });

  const onSubmit: SubmitHandler<ArticleTest> = (data) => {
    console.log(`Data before ${JSON.stringify(data)}`);
    // mutation.mutate(data);
  };

  // async function onSubmit(event: FormEvent<HTMLFormElement>) {
  //   console.log(formData);
  //   const formData = new FormData(event.currentTarget);
  //   console.log(formData);
  //   mutation.mutate(formData);
  // }

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
                  <Input placeholder="shadcn" {...field} />
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
                    <SelectTrigger className="w-[180px]">
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

          {/* <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  <Input type="file" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
