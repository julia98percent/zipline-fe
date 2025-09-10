import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

interface CustomLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

const CustomLink = ({
  href,
  children,
  className,
  target,
  rel,
  ...props
}: CustomLinkProps) => {
  const isExternalLink =
    /^(https?:|mailto:|tel:)/.test(href) || href.startsWith("//");

  if (isExternalLink) {
    return (
      <a
        href={href}
        className={className}
        target={target || "_blank"}
        rel={rel || "noopener noreferrer"}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href as LinkProps<string>["href"]}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
};

export default CustomLink;
