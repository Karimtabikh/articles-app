import type { Article } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

// import { useEffect } from "react";
// import { useInView } from "react-intersection-observer";

const InfiniteScroll = () => {
  // const { ref, inView } = useInView();
  const [filter, setFilter] = useState({
    title: "",
    description: "",
    sortby: "title",
    sortOrder: "asc",
  });

  const fetchArticles = async ({ pageParam }: { pageParam: number }) => {
    const res = await fetch(
      `http://localhost:3000/articles?title=${filter.title}&description=${filter.description}&sortBy=${filter.sortby}&sortOrder=${filter.sortOrder}`,
    );

    return res.json();
  };

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["projects", filter],
    queryFn: fetchArticles,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
  });

  // useEffect(() => {
  //   if (inView) {
  //     fetchNextPage();
  //   }
  // }, [fetchNextPage, inView]);

  const handleChange = (value: string, field: string) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value,
    }));
  };

  console.log(filter);

  return (
    <>
      <div className="mb-2">
        <h2 className="my-4 text-lg font-bold">Filter By:</h2>
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
        <p>Loading...</p>
      ) : status === "error" ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          <div className="grid gap-2">
            {data.pages.map((page) => (
              <div key={page.nextId} className="grid grid-cols-3 gap-2">
                {page.data.map((article: Article) => (
                  <div className="rounded-md bg-white p-3" key={article.id}>
                    <p className="font-semibold capitalize text-gray-500">
                      {article.category}
                    </p>
                    <h1 className="my-1 text-xl font-bold">{article.title}</h1>
                    <div className="">{article.description}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div>
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button
              // ref={ref}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                  ? "Load Newer"
                  : "Nothing more to load"}
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default InfiniteScroll;
