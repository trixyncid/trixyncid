import { cn } from "@/lib/utils";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "article";
  size?: "default" | "narrow" | "wide";
};

const sizes = {
  // Matches the header and hero so section edges line up down the page.
  default: "max-w-7xl",
  narrow: "max-w-4xl",
  wide: "max-w-7xl",
};

export function Container({
  as: Component = "div",
  size = "default",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
