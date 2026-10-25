import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "quiet";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-chilli text-rice hover:bg-chilli/90 focus-visible:ring-chilli",
  secondary:
    "border border-ink text-ink hover:bg-ink/5 focus-visible:ring-chilli",
  quiet: "text-ink underline-offset-4 hover:underline focus-visible:ring-chilli",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-rice disabled:opacity-50 disabled:pointer-events-none";

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", children, className = "" } = props;
  const classes = `${baseClasses} ${
    variant === "quiet" ? "" : "rounded-full"
  } ${variantClasses[variant]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const {
    href: _href,
    variant: _variant,
    children: _buttonChildren,
    className: _className,
    ...rest
  } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
