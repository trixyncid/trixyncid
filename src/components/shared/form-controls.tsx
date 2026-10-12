import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const formControlClass =
  "w-full rounded-xl border border-foreground/45 bg-background/80 px-4 py-3 text-sm text-foreground transition-[border-color,box-shadow] duration-200 hover:border-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/40 dark:border-foreground/40";

type FieldProps = {
  id: string;
  label: string;
  children: React.ReactNode;
  className?: string;
  hint?: string;
};

export function FormField({ id, label, children, className, hint }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground/90">
        {label}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function FormInput({ className, ...props }: FormInputProps) {
  return <input className={cn(formControlClass, className)} {...props} />;
}

type FormTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormTextarea({ className, ...props }: FormTextareaProps) {
  return <textarea className={cn(formControlClass, "resize-none", className)} {...props} />;
}

type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function FormSelect({ className, children, ...props }: FormSelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(formControlClass, "appearance-none pr-11", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
    </div>
  );
}
