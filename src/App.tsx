import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import SpinnerLoader from "./components/loaders/SpinnerLoader";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <RouterProvider
      router={router}
      defaultPendingComponent={SpinnerLoader}
      defaultPendingMs={200}
    />
  );
}
