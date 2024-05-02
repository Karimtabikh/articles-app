import { createLazyFileRoute } from "@tanstack/react-router";
import { InputForm } from "@/components/Form/InputFormTest";
import { QueryClient, QueryClientProvider } from "react-query";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

const queryClient = new QueryClient()

function Index() {
  return (
    <div className="p-2">
      <h3>Form</h3>
      <QueryClientProvider client={queryClient}>
        <InputForm />
      </QueryClientProvider>
    </div>
  );
}
