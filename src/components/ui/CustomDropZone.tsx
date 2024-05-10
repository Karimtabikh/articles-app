import { useState } from "react";

import { Button } from "./button";

export default function CustomDropZone() {
  const [files, setFiles] = useState<File[]>([]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const total_files: File[] = [];

    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        total_files.push(event.target.files[i]);
      }
    }

    setFiles((prevFiles) => [...prevFiles, ...total_files]);
  }

  function handleDrag(event: React.DragEvent<HTMLInputElement>) {
    event.preventDefault();
    const total_files: File[] = [];

    if (event.dataTransfer.files) {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        total_files.push(event.dataTransfer.files[i]);
      }
    }

    setFiles((prevFiles) => [...prevFiles, ...total_files]);
  }

  const removeFile = (index: number) => {
    setFiles((prevFiles) => {
      return prevFiles.filter((_, i) => i !== index);
    });
  };

  return (
    <div>
      <div className="items-center justify-center rounded-lg border-2 border-dashed shadow-sm">
        <div
          className="text-muted-foreground relative flex w-full flex-col items-center justify-center hover:cursor-pointer"
          onDrop={handleDrag}
        >
          <span className="text-sl absolute font-medium ">Drag and Drop</span>
          <input
            className="h-32 w-full opacity-0 hover:cursor-pointer"
            type="file"
            name="files"
            onChange={handleChange}
            multiple
            accept="images/*"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {files?.map((file, index) => {
          return (
            <div className="relative" key={URL.createObjectURL(file)}>
              <img
                className="w-[150px]"
                src={URL.createObjectURL(file)}
                alt=""
              />
              <Button
                type="button"
                className="absolute right-2 top-2 h-6 rounded-full bg-black p-0 px-2 text-base text-white"
                onClick={() => removeFile(index)}
              >
                x
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
