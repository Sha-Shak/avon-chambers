import { FaWhatsapp } from "react-icons/fa6";
import { getWhatsAppUrl } from "@/lib/whatsapp";

/** Persistent click-to-chat button, mounted once in the site layout so it floats on every page. */
export function WhatsAppButton() {
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <FaWhatsapp className="size-7" />
    </a>
  );
}
