"use client";

import { AutoResizeTextarea } from "@/components/ui/autoresizetextarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { z } from "zod";

import Dropzone from "../ui/Dropzone";
import useAutosizeTextArea from "../useAutosizeTextArea";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = ["image/png"];

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  description: z.string(),
  category: z.string(),
  file: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB")
    .refine((file) => {
      return ACCEPTED_FILE_TYPES.includes(file.type);
    }, "File must be a PNG"),
});

export function InputForm() {
  const [value, setValue] = useState("");
  const [filePreviews, setFilePreviews] = useState([]);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, value);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;

    setValue(val);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      file: null,
    },
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
  });

  function removeFilePreview(index: number) {
    const updatedPreviews = [...filePreviews];
    updatedPreviews.splice(index, 1);
    setFilePreviews(updatedPreviews);
    form.setValue("file", null);
  }

  function handleOnDrop(acceptedFiles: FileList | null) {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const allowedTypes = [
        {
          name: "image",
          types: ["image/png", "image/jpg", "image/jpeg"],
        },
      ];
      const fileType = allowedTypes.find((allowedType) =>
        allowedType.types.find((type) => type === acceptedFiles[0].type),
      );
      if (!fileType) {
        form.setValue("file", null);
        form.setError("file", {
          message: "File type is not valid",
          type: "typeError",
        });
      } else {
        form.setValue("file", acceptedFiles[0]);
        form.clearErrors("file");

        const filePreviews = Array.from(acceptedFiles).map((file) =>
          URL.createObjectURL(file),
        );
        setFilePreviews(filePreviews);
      }
    } else {
      form.setValue("file", null);
      form.setError("file", {
        message: "File is required",
        type: "typeError",
      });
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>): void {
    handleOnDrop(event.clipboardData.files);
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.message("Form Submitted");
  }

  return (
    <>
      <Toaster />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
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
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <AutoResizeTextarea
                    {...field}
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
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Category" {...field} />
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

          <div onPaste={handlePaste}>
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Dropzone
                      {...field}
                      dropMessage="Drop files or click here"
                      multiple
                      handleOnDrop={handleOnDrop}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-2 flex space-x-2">
              {filePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img src={preview} className="h-32 w-32 object-cover" />
                  <button
                    type="button"
                    className="absolute right-1 top-1 rounded-full bg-white px-1 font-mono text-xs font-medium	text-black"
                    onClick={() => removeFilePreview(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
