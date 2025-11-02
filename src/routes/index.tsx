import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { GitHubLogo } from "@/components/logo/GitHubLogo";
import {
  Authenticated,
  Unauthenticated,
  useAction,
  useConvexAuth,
} from "convex/react";
import { LogOutIcon } from "lucide-react";
import { api } from "convex/_generated/api";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const { signIn, signOut } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const callAction = useAction(api.test.get);

  return (
    <div className="bg-muted-foreground flex flex-col gap-4">
      Lets begin
      <Authenticated>
        <div className="flex flex-col gap-4 justify-center">
          You are Authenticated
          <Button
            className="cursor-pointer w-fit"
            variant="outline"
            type="button"
            onClick={() => void signOut()}
          >
            <LogOutIcon className="mr-2 h-4 w-4" /> Logout
          </Button>
          <Button
            variant={"outline"}
            className="w-fit"
            onClick={() => {
              callAction();
            }}
          >
            Call Action
          </Button>
        </div>
      </Authenticated>
      <Unauthenticated>
        <Button
          className="cursor-pointer w-fit"
          variant="outline"
          type="button"
          onClick={() => void signIn("github")}
        >
          <GitHubLogo className="mr-2 h-4 w-4" /> GitHub
        </Button>
      </Unauthenticated>
    </div>
  );
}
