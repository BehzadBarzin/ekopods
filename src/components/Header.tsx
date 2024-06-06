import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { FC } from "react";

interface IProps {
  headerTitle?: string;
  titleClassName?: string;
}

const Header: FC<IProps> = ({ headerTitle, titleClassName }) => {
  return (
    <header className="flex items-center justify-between">
      {/* ------------------------------------------------------------------ */}
      {/* Header title */}
      {headerTitle ? (
        <h1 className={cn("text-18 font-bold text-white-1", titleClassName)}>
          {headerTitle}
        </h1>
      ) : (
        <div />
      )}
      {/* ------------------------------------------------------------------ */}
      {/* See all link */}
      <Link href="/discover" className="text-16 font-semibold text-orange-1">
        See all
      </Link>
      {/* ------------------------------------------------------------------ */}
    </header>
  );
};

export default Header;
