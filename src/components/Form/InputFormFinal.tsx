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
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";

import { formSchema } from "../../schema/ZodValidationtest";
import { AutoResizeTextarea } from "../ui/autoresizetextarea";
import { Card, CardContent } from "../ui/card";
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

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((prevFiles) => {
        const newFiles = [];
        for (const file of acceptedFiles) {
          // Check both name and size to make sure it's not already uploaded
          if (
            !prevFiles.some((f) => f.name === file.name && f.size === file.size)
          ) {
            newFiles.push(file);
          }
        }
        return [...prevFiles, ...newFiles];
      });

      // Generate previews for new files
      // biome-ignore lint/complexity/noForEach: <explanation>
      acceptedFiles.forEach((file) => {
        if (!files.some((f) => f.name === file.name && f.size === file.size)) {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result) {
              setPreviews((prevPreviews) => [
                ...prevPreviews,
                e.target.result as string,
              ]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    },
    [files],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, idx) => idx !== index));
    setPreviews((current) => current.filter((_, idx) => idx !== index));
  };

  const form = useForm<ArticleTest>({
    defaultValues: {
      title: "",
      category: "",
      description: "",
      file: "",
    },
    resolver: zodResolver(formSchema),
  });

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
    files.forEach((file) => {
      formData.append("file", file);
    });

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

          <div {...getRootProps()}>
            <Card className="bg-muted hover:border-muted-foreground/50 border-2 border-dashed py-12 hover:cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...getInputProps()} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag and drop some files here, or click to select files</p>
                )}
              </CardContent>
            </Card>
          </div>

          {previews.map((preview, index) => (
            <div key={index}>
              <img src={preview} className="w-[150px]" alt="Upload preview" />
              <button type="button" onClick={() => removeFile(index)}>
                Remove
              </button>
            </div>
          ))}

          <Button className="w-full py-6 text-base" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
