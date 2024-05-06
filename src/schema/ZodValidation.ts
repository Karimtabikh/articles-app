import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpg", "image/jpeg"];

export const FormSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  file: z
    .instanceof(FileList)
    // .nullable()
    // .optional()
    // .refine((file) => {
    //   return !file || file.size <= MAX_UPLOAD_SIZE;
    // }, "File size must be less than 3MB")
    // .refine((file) => {
    //   return ACCEPTED_FILE_TYPES.includes(file.type);
    // }, "File must be a PNG"),
});
