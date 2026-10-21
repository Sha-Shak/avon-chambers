import { FaWhatsapp } from "react-icons/fa6";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** Prominent WhatsApp click-to-chat button — the primary contact call-to-action
 *  wherever a lead-capture form used to sit (see ConsultationSection and the
 *  Contact page). `message` pre-fills the chat, e.g. with a page's own heading. */
export function WhatsAppCta({ message, className, label = "Contact us on WhatsApp" }: { message?: string; className?: string; label?: string }) {
  return (
    <a
      href={getWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-16 w-full items-center justify-center gap-3 bg-[#25D366] px-8 text-base font-medium tracking-wide text-white transition-transform hover:scale-[1.02]",
        className,
      )}
    >
      <FaWhatsapp className="size-6" />
      {label}
    </a>
  );
}
