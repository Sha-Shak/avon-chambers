import {
  Banknote,
  Briefcase,
  BriefcaseBusiness,
  Building2,
  Calculator,
  Copyright,
  Gavel,
  Globe,
  Handshake,
  HeartHandshake,
  Home,
  Landmark,
  Laptop,
  Plane,
  Scale,
  ScrollText,
  Sparkles,
  Users,
  UsersRound,
  type LucideProps,
} from "lucide-react";

/**
 * Practice area icons are stored as string names in data/practice-areas.json
 * (JSON can't hold a component reference). Add a case here whenever a new
 * icon name is introduced in that file — the switch below is the single
 * source of truth for which names are valid, so a typo or a not-yet-added
 * name falls back to Building2 instead of erroring.
 *
 * This returns JSX directly (rather than resolving to a component reference
 * that callers assign to a variable and render as `<Icon />`) so the actual
 * icon tags used are always the statically-imported identifiers - React and
 * the linter can both see the real, stable component being rendered.
 */
export function PracticeAreaIcon({ name, ...props }: { name: string } & LucideProps) {
  switch (name) {
    case "Banknote":
      return <Banknote {...props} />;
    case "Briefcase":
      return <Briefcase {...props} />;
    case "BriefcaseBusiness":
      return <BriefcaseBusiness {...props} />;
    case "Building2":
      return <Building2 {...props} />;
    case "Calculator":
      return <Calculator {...props} />;
    case "Copyright":
      return <Copyright {...props} />;
    case "Gavel":
      return <Gavel {...props} />;
    case "Globe":
      return <Globe {...props} />;
    case "Handshake":
      return <Handshake {...props} />;
    case "HeartHandshake":
      return <HeartHandshake {...props} />;
    case "Home":
      return <Home {...props} />;
    case "Landmark":
      return <Landmark {...props} />;
    case "Laptop":
      return <Laptop {...props} />;
    case "Plane":
      return <Plane {...props} />;
    case "Scale":
      return <Scale {...props} />;
    case "ScrollText":
      return <ScrollText {...props} />;
    case "Sparkles":
      return <Sparkles {...props} />;
    case "Users":
      return <Users {...props} />;
    case "UsersRound":
      return <UsersRound {...props} />;
    default:
      return <Building2 {...props} />;
  }
}
