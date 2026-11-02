import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { HiArrowLeft, HiArrowRight, HiArrowUpRight } from "react-icons/hi2";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children"> & {
  href: string;
  children: ReactNode;
  accent?: "yellow" | "pink" | "blue" | "green" | "violet";
  arrow?: "back" | "forward" | "diagonal";
  external?: boolean;
  tone?: "accent" | "quiet" | "neutral";
};

export default function ActionLink({
  href,
  children,
  accent = "blue",
  arrow = "forward",
  external = false,
  tone = "accent",
  className = "",
  ...props
}: Props) {
  const arrowIcon = (
    <span aria-hidden="true" className="action-link-arrow">
      {arrow === "back" ? (
        <HiArrowLeft size={16} />
      ) : arrow === "diagonal" ? (
        <HiArrowUpRight size={16} />
      ) : (
        <HiArrowRight size={16} />
      )}
    </span>
  );
  const content = <>{arrow === "back" && arrowIcon}<span className="action-link-label">{children}</span>{arrow !== "back" && arrowIcon}</>;
  const shared = {
    ...props,
    href,
    className: `action-link ${className}`,
    "data-accent": accent,
    "data-arrow": arrow,
    "data-tone": tone,
  };

  return external ? (
    <a {...shared} target="_blank" rel="noopener noreferrer">{content}</a>
  ) : (
    <Link {...shared}>{content}</Link>
  );
}
