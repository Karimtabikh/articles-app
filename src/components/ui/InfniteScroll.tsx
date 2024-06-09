import { useThrottle } from "@/hook/useThrottle";
import type { Article } from "@/types";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";

const InfiniteScroll = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);

  const [filter, setFilter] = useState({
    title: "",
    category: "",
    description: "",
    sortby: "title",
    sortOrder: "asc",
  });

  const throttledFilter = useThrottle(filter, 500);

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:3000/articles/categories");
    return res.json();
  };

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const fetchArticles = async (page = 0) => {
    const res = await fetch(
      `http://localhost:3000/articles?page=${page}&category=${throttledFilter.category}&title=${throttledFilter.title}&description=${throttledFilter.description}&sortBy=${throttledFilter.sortby}&sortOrder=${throttledFilter.sortOrder}`,
    );

    return res.json();
  };

  const { status, data, error, isFetching, isPlaceholderData } = useQuery({
    queryKey: ["articles", throttledFilter, page],
    queryFn: () => fetchArticles(page),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

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

  const handleChange = (value: string, field: string) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value,
    }));
  };

  return (
    <>
      <div className="mb-2">
        <h2 className="my-4 text-lg font-bold">Filter By:</h2>

        <div className="mb-8">
          <label className="mr-4 font-bold">Categories</label>
          <select
            name="category"
            className="capitalize"
            onChange={(event) => handleChange(event.target.value, "category")}
          >
            <option value={""}>All</option>
            {categoriesQuery.data?.map((category) => {
              return (
                <option key={category.category} value={category.category}>
                  {category.category}
                </option>
              );
            })}
          </select>
        </div>

        <div className="mb-8">
          <label className="mr-4 font-bold">Title</label>
          <input
            name="title"
            onChange={(event) => handleChange(event.target.value, "title")}
            type="search"
          />
        </div>
        <div className="mb-8">
          <label className="mr-4 font-bold">Description</label>
          <input
            name="description"
            onChange={(event) =>
              handleChange(event.target.value, "description")
            }
            type="search"
          />
        </div>
        <label>Sort By:</label>
        <select
          name="sortBy"
          onChange={(event) => handleChange(event.target.value, "sortBy")}
        >
          <option value="title">Title</option>
          <option value="createdAt">Date</option>
        </select>

        <label>Order:</label>
        <select
          name="sortOrder"
          onChange={(event) => handleChange(event.target.value, "sortOrder")}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {status === "pending" ? (
        <div>Loading...</div>
      ) : status === "error" ? (
        <div>Error: {error.message}</div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {data.posts.map((article: Article) => (
              <div className="rounded-md bg-white p-3" key={article.id}>
                <p className="font-semibold capitalize text-gray-500">
                  {article.category}
                </p>
                <h1 className="my-1 text-xl font-bold">{article.title}</h1>
                <div className="">{article.description}</div>
              </div>
            ))}
          </div>
          <div>Current Page: {page + 1}</div>
          <div>Total Page: {data.totalPages + 1}</div>
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
