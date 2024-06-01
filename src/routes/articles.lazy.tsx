import InfiniteScroll from "@/components/ui/InfniteScroll";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/articles")({
  component: Articles,
});
const queryClient = new QueryClient();

function Articles() {
  return (
    <div className="p-2">
      <div className="mb-5">All Articles</div>
      <div>
        <QueryClientProvider client={queryClient}>
          <InfiniteScroll />
        </QueryClientProvider>
      </div>
    </div>
  );
}
