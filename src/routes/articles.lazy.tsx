import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/articles")({
	component: Articles,
});

function Articles() {
	return <div className="p-2">All Articles</div>;
}
