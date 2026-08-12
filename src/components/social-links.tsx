import { FaFacebook, FaInstagram, FaLinkedin, FaThreads, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

const platforms = [
  { key: "linkedIn", label: "LinkedIn", Icon: FaLinkedin },
  { key: "facebook", label: "Facebook", Icon: FaFacebook },
  { key: "instagram", label: "Instagram", Icon: FaInstagram },
  { key: "twitter", label: "X (formerly Twitter)", Icon: FaXTwitter },
  { key: "threads", label: "Threads", Icon: FaThreads },
  { key: "youtube", label: "YouTube", Icon: FaYoutube },
  { key: "tiktok", label: "TikTok", Icon: FaTiktok },
] as const;

/** Reused on the footer, contact page and consultation CTA — one source of truth for the platform list. */
export function SocialLinks({
  variant = "dark",
  className,
}: {
  /** "dark" for use on a navy background (cream icons), "light" for the default page background. */
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={cn("flex gap-4", className)}>
      {platforms.map(({ key, label, Icon }) => (
        <a
          key={key}
          href={siteConfig.social[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={variant === "dark" ? "text-cream/60 hover:text-cream" : "text-muted-foreground hover:text-foreground"}
        >
          <Icon className="size-4" />
        </a>
      ))}
    </div>
  );
}
