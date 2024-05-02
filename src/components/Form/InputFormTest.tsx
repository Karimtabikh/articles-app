import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormSchema } from "../../schema/ZodValidation";
import Dropzone from "../ui/Dropzone";
import { useMutation } from "react-query";
import * as article from "@/lib/api/article";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { AutoResizeTextarea } from "../ui/autoresizetextarea";
import { useState, useRef } from "react";
import useAutosizeTextArea from "../useAutosizeTextArea";
import { Article } from "@/types";

type FormSchemaType = z.infer<typeof FormSchema>;

export function InputForm() {
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, value);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;

    setValue(val);
  };

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      // category: "",
      description: "",
    },
  });

  // function removeFilePreview(index: number) {
  //   const updatedPreviews = [...filePreviews];
  //   updatedPreviews.splice(index, 1);
  //   setFilePreviews(updatedPreviews);
  //   form.setValue("file", null);
  // }

  // function handleOnDrop(acceptedFiles: FileList | null) {
  //   if (acceptedFiles && acceptedFiles.length > 0) {
  //     const allowedTypes = [
  //       {
  //         name: "image",
  //         types: ["image/png", "image/jpg", "image/jpeg"],
  //       },
  //     ];
  //     const fileType = allowedTypes.find((allowedType) =>
  //       allowedType.types.find((type) => type === acceptedFiles[0].type)
  //     );
  //     if (!fileType) {
  //       form.setValue("file", null);
  //       form.setError("file", {
  //         message: "File type is not valid",
  //         type: "typeError",
  //       });
  //     } else {
  //       form.setValue("file", acceptedFiles[0]);
  //       form.clearErrors("file");

  //       const filePreviews = Array.from(acceptedFiles).map((file) =>
  //         URL.createObjectURL(file)
  //       );
  //       setFilePreviews(filePreviews);
  //     }
  //   } else {
  //     form.setValue("file", null);
  //     form.setError("file", {
  //       message: "File is required",
  //       type: "typeError",
  //     });
  //   }
  // }

  // function handlePaste(event: ClipboardEventHandler<HTMLDivElement>): void {
  //   handleOnDrop(event.clipboardData.files);
  // }

  const mutation = useMutation({
    mutationFn: (data: FormSchemaType) => {
      return article.create(data);
    },
    onSuccess: () => {
      alert("Artciel created");
    },
  });

  function onSubmit(data: FormSchemaType) {
    console.log(data);
    toast.message("Form Submitted");
    mutation.mutate(data);
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

          {/* <FormField
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

            <div className="flex space-x-2 mt-2">
              {filePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img src={preview} className="w-32 h-32 object-cover" />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white rounded-full text-black text-xs px-1 font-medium	font-mono"
                    onClick={() => removeFilePreview(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div> */}

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
