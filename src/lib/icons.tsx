import { Briefcase, Building2, Home, Plane, Scale, Users, type LucideProps } from "lucide-react";

/**
 * Practice area icons are stored as string names in data/practice-areas.json
 * (JSON can't hold a component reference). Add a case here whenever a new
 * icon name is introduced in that file.
 *
 * This returns JSX directly (rather than resolving to a component reference
 * that callers assign to a variable and render as `<Icon />`) so the actual
 * icon tags used are always the statically-imported identifiers - React and
 * the linter can both see the real, stable component being rendered.
 */
export function PracticeAreaIcon({ name, ...props }: { name: string } & LucideProps) {
  switch (name) {
    case "Briefcase":
      return <Briefcase {...props} />;
    case "Building2":
      return <Building2 {...props} />;
    case "Home":
      return <Home {...props} />;
    case "Plane":
      return <Plane {...props} />;
    case "Scale":
      return <Scale {...props} />;
    case "Users":
      return <Users {...props} />;
    default:
      return <Building2 {...props} />;
  }
}
