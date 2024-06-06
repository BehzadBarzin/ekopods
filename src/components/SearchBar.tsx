"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@/lib/useDebounce";

const SearchBar = () => {
  // ---------------------------------------------------------------------------
  // Current Search Value
  const [search, setSearch] = useState("");
  // ---------------------------------------------------------------------------
  const router = useRouter();
  const pathname = usePathname();
  // ---------------------------------------------------------------------------
  // Debounced Search Value (Delayed Search Value)
  const debouncedValue = useDebounce(search, 500);
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // When delayed search value changes
  useEffect(() => {
    if (debouncedValue) {
      // If delayed search term is not empty, go to /discover page with search term
      router.push(`/discover?search=${debouncedValue}`);
    } else if (!debouncedValue && pathname === "/discover") {
      // If delayed search term is empty and on discover page, go back to /discover page
      router.push("/discover");
    }
  }, [router, pathname, debouncedValue]);
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  return (
    <div className="relative mt-8 block">
      <Input
        className="input-class py-6 pl-12 focus-visible:ring-offset-orange-1"
        placeholder="Search for podcasts"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onLoad={() => setSearch("")}
      />
      <Image
        src="/icons/search.svg"
        alt="search"
        height={20}
        width={20}
        className="absolute left-4 top-3.5"
      />
    </div>
  );
};

export default SearchBar;
