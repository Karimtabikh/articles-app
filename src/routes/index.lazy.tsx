import { InputForm } from "@/components/Form/InputFormFinal";
import { createLazyFileRoute } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "react-query";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

const queryClient = new QueryClient();

function Index() {
  return (
    <div className="mx-auto flex w-[800px] flex-col items-center p-2 max-sm:w-full">
      <h3 className="text-3xl font-bold">Form</h3>
      <QueryClientProvider client={queryClient}>
        <InputForm />
      </QueryClientProvider>
    </div>
  );
}
