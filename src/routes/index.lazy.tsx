import { createLazyFileRoute } from "@tanstack/react-router";
import { InputForm } from "@/components/Form/InputForm";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Form</h3>
      <InputForm />
    </div>
  );
}
