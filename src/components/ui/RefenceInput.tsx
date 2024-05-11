import * as article from "@/lib/api/article";
import type { Article } from "@/types";
import { useQuery } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export default function RefenceInput() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["article"],
    queryFn: () => article.get(),
  });

  console.log(data);

  return (
    <>
      <label className="text-base font-medium peer-disabled:cursor-not-allowed">
        Reference
      </label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose the related articles" />
        </SelectTrigger>
        <SelectContent>
          {data?.map((article: Article) => (
            <SelectItem key={article.title} value={article.title}>
              {article.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
