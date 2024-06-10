import { useThrottle } from "@/hook/useThrottle";
import type { Article } from "@/types";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface filterType {
  search: string;
  category: string;
  sortby: string;
  sortOrder: string;
  startDate: Date | null;
  endDate: Date | null;
}

const InfiniteScroll = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [filter, setFilter] = useState<filterType>({
    search: "",
    category: "",
    sortby: "title",
    sortOrder: "asc",
    startDate: null,
    endDate: null,
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
    const url = new URL("http://localhost:3000/articles");
    if (page) {
      url.searchParams.append("page", page.toString());
    }
    if (throttledFilter.category) {
      url.searchParams.append("category", throttledFilter.category);
    }
    if (throttledFilter.search) {
      url.searchParams.append("search", throttledFilter.search);
    }
    if (throttledFilter.sortby) {
      url.searchParams.append("sortBy", throttledFilter.sortby);
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

  const handleDateChange = (range: [Date | null, Date | null]) => {
    console.log(range);
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);
    setFilter((prevFilter) => ({
      ...prevFilter,
      startDate: startDate ? startDate : null,
      endDate: endDate ? endDate : null,
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
          <label className="mr-4 font-bold">Search</label>
          <input
            name="search"
            onChange={(event) => handleChange(event.target.value, "search")}
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

        <label>Sort By Date:</label>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
        />
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
