import { createFileRoute } from "@tanstack/react-router";
import { MarinovateHome } from "@/components/marinovate/MarinovateHome";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <MarinovateHome />;
}
