import { Article } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const InfiniteScroll = () => {
  const { ref, inView } = useInView();

  const fetchArticles = async ({ pageParam }: { pageParam: number }) => {
    const res = await fetch(
      `http://localhost:3000/articles?cursor=${pageParam}`,
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
    queryKey: ["projects"],
    queryFn: fetchArticles,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <>
      <div className="mb-2"> Filtering </div>
      {status === "pending" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          <div>
            {data.pages.map((page) => (
              <div key={page.nextId} className="grid grid-cols-3 gap-2">
                {page.data.map((article: Article) => (
                  <div className="rounded-md bg-white p-3" key={article.id}>
                    {/* {article.files.map((file) => {
                      return <p>{file.name}</p>;
                    })} */}
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
            <button
              ref={ref}
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
