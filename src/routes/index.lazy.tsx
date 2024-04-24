import { createLazyFileRoute } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h3>Form</h3>
      <Button>Click me</Button>

    </div>
  )
}