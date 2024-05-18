import { Button } from "./button";

type Props = {
  values: File[];
  onFilesChange: (newfiles: File[]) => void;
};

export default function CustomDropZone({ values, onFilesChange }: Props) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const eventFiles = event.target.files;
    handleFiles(eventFiles);
  }

  function handleDrag(event: React.DragEvent<HTMLInputElement>) {
    event.preventDefault();
    const eventFiles = event.dataTransfer.files;
    handleFiles(eventFiles);
  }

  const handleFiles = (eventFiles: FileList | null) => {
    const total_files: File[] = [];

    if (eventFiles) {
      for (let i = 0; i < eventFiles.length; i++) {
        total_files.push(eventFiles[i]);
      }
    }

    onFilesChange([...values, ...total_files]);
  };

  const removeFile = (index: number) => {
    onFilesChange(values.filter((_, i) => i !== index));
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
        {values?.map((file, index) => {
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
