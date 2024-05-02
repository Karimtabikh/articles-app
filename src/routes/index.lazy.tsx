import { createLazyFileRoute } from "@tanstack/react-router";
import { InputForm } from "@/components/Form/InputFormTest";

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
