import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import Spinner from "./components/Spinner";

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
      defaultPendingComponent={Spinner}
      defaultPendingMs={200}
    />
  );
}
