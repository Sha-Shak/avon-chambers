import { FaWhatsapp } from "react-icons/fa6";
import { siteConfig } from "@/config/site.config";

/** Persistent click-to-chat button, mounted once in the site layout so it floats on every page. */
export function WhatsAppButton() {
  const digits = siteConfig.whatsapp.number.replace(/\D/g, "");
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(siteConfig.whatsapp.message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <FaWhatsapp className="size-7" />
    </a>
  );
}
