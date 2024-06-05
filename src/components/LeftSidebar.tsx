"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { sidebarLinks, TSidebarLink } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const LeftSidebar = () => {
  const pathName = usePathname();
  const router = useRouter(); // make sure it's imported from next/navigation

  return (
    <section className="left_sidebar">
      <nav className="flex flex-col gap-6">
        {/* Home */}
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center"
        >
          <Image src="/icons/logo.png" alt="logo" width={23} height={27} />
          <h1 className="text-24 font-extrabold text-white max-lg:hidden">
            Ekopods
          </h1>
        </Link>
        {/* Sidebar Links */}
        {sidebarLinks.map(({ imgURL, route, label }: TSidebarLink) => {
          // Is this nav link the current active path?
          const isActive =
            pathName === route || pathName.startsWith(`${route}/`);

          return (
            <Link
              href={route}
              key={label}
              className={cn(
                "flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start border-r-4 border-transparent",
                {
                  "bg-nav-focus border-orange-1": isActive,
                }
              )}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p>{label}</p>
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default LeftSidebar;
