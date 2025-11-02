import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <>
      <header className="p-4 flex items-center bg-muted-foreground text-white shadow-sm">
        <h1 className="ml-4 text-xl font-semibold">
          <Link to="/">
            <img
              src="/tanstack-circle-logo.png"
              alt="TanStack Logo"
              className="h-10"
            />
          </Link>
        </h1>
      </header>
    </>
  );
}
