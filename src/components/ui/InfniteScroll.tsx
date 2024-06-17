import { useThrottle } from "@/hook/useThrottle";
import type { Article } from "@/types";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";

import Filter from "./filter";

interface filterType {
  search: string;
  filterCategories: string[];
  sortOrder: string;
  startDate: Date | null;
  endDate: Date | null;
}

const InfiniteScroll = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);

  const [filter, setFilter] = useState<filterType>({
    search: "",
    filterCategories: categories,
    sortOrder: "asc",
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      filterCategories: categories,
    }));
  }, [categories]);

  const throttledFilter = useThrottle(filter, 500);

  const { status, data, error, isFetching, isPlaceholderData } = useQuery({
    queryKey: ["articles", throttledFilter, page],
    queryFn: () => fetchArticles(page),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const fetchArticles = async (page = 0) => {
    const url = new URL("http://localhost:3000/articles");
    if (page) {
      url.searchParams.append("page", page.toString());
    }
    if (
      throttledFilter.filterCategories &&
      throttledFilter.filterCategories.length > 0
    ) {
      url.searchParams.append(
        "category",
        throttledFilter.filterCategories.join(","),
      );
    }
    if (throttledFilter.search) {
      url.searchParams.append("search", throttledFilter.search);
    }
    if (throttledFilter.sortOrder) {
      url.searchParams.append("sortOrder", throttledFilter.sortOrder);
    }
    if (throttledFilter.startDate) {
      url.searchParams.append(
        "startDate",
        throttledFilter.startDate.toISOString(),
      );
    }
    if (throttledFilter.endDate) {
      url.searchParams.append("endDate", throttledFilter.endDate.toISOString());
    }

    const res = await fetch(url);

    return res.json();
  };

  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ["articles", throttledFilter, page + 1],
        queryFn: () => fetchArticles(page + 1),
      });
    }
  }, [
    data,
    isPlaceholderData,
    page,
    queryClient,
    fetchArticles,
    throttledFilter,
  ]);

  return (
    <>
      <Filter
        setFilter={setFilter}
        categoriesProp={categories}
        setCategories={setCategories}
      />

      {status === "pending" ? (
        <div>Loading...</div>
      ) : status === "error" ? (
        <div>Error: {error.message}</div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {data?.posts?.map((article: Article) => (
              <div className="rounded-md bg-white p-3" key={article.id}>
                <p className="font-semibold capitalize text-gray-500">
                  {article.category}
                </p>
                <div
                  className="my-1 text-xl font-bold"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                  dangerouslySetInnerHTML={{
                    __html: article.title,
                  }}
                />
                <div
                  className="line-clamp-3"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                  dangerouslySetInnerHTML={{
                    __html: article.description,
                  }}
                />
              </div>
            ))}
          </div>
          <div>Current Page: {page + 1}</div>
          <div>Total Page: {data?.totalPages + 1}</div>
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 0))}
            disabled={page === 0}
          >
            Previous Page
          </button>{" "}
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button
            onClick={() => {
              setPage((old) => (data?.hasMore ? old + 1 : old));
            }}
            disabled={isPlaceholderData || !data?.hasMore}
          >
            Next Page
          </button>
          {isFetching ? <span> Loading...</span> : null}
        </>
      )}
    </>
  );
};

export default InfiniteScroll;
