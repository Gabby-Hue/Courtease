"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Volleyball, X } from "lucide-react";
import { NavbarAuthMenu } from "@/components/navbar-auth-menu";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { SearchDropdown } from "@/components/search/search-dropdown";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/venues", label: "Venues" },
  { href: "/forum", label: "Forum" },
];

export function CourteaseNavbar() {
  const pathname = usePathname() || "/";
  const [openSearch, setOpenSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpenSearch((prev) => !prev);
      }
      if (event.key === "Escape") {
        setOpenSearch(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenSearch(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Volleyball className="h-6 w-6" />
            CourtEase
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                  pathname === link.href
                    ? "text-foreground"
                    : "text-foreground/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex"
              onClick={() => setOpenSearch(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              Search...
              <kbd className="ml-2 rounded border px-1 py-0 text-[10px]">
                ⌘K
              </kbd>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="sm:hidden"
              onClick={() => setOpenSearch(true)}
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            <ModeToggle />
            <NavbarAuthMenu />
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="border-t md:hidden">
            <nav className="container py-4">
              <div className="flex flex-col gap-2">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center py-2 text-sm font-medium transition-colors hover:text-foreground/80 ${
                      pathname === link.href
                        ? "text-foreground"
                        : "text-foreground/60"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Search Dropdown */}
      <SearchDropdown isOpen={openSearch} onClose={() => setOpenSearch(false)} />
    </>
  );
}