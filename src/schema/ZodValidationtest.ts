import { z } from "zod";

export const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  file: z.string(),
});
