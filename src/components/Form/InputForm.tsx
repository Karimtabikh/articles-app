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
import type { Article } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { formSchema } from "../../schema/ZodValidation";
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
  const [selectedValues, setSelectedValues] = useState<Article[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, value);

  const handleSelectedChange = (newValues: Article[]) => {
    setSelectedValues(newValues);
  };

  const handleFiles = (newfiles: File[]) => {
    setFiles(newfiles);
  };

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(evt.target?.value);
  };

  const form = useForm<Article>({
    defaultValues: {
      title: "",
      category: "",
      description: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { data } = useQuery({
    queryKey: ["article"],
    queryFn: () => article.get(),
  });

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return article.create(formData);
    },
    onSuccess: () => {
      console.log("Article created");
    },
  });

  const onSubmit: SubmitHandler<Article> = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);

    for (let i = 0; i < files.length; i++) {
      formData.append("files[]", files[i]);
    }

    for (let i = 0; i < selectedValues.length; i++) {
      formData.append("reference[]", selectedValues[i].title);
    }

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

          <CustomDropZone values={files} onFilesChange={handleFiles} />

          {data && data.length > 0 && (
            <CustomSelect
              options={data}
              values={selectedValues}
              onSelectedChange={handleSelectedChange}
            />
          )}

          <Button className="w-full py-6 text-base" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
