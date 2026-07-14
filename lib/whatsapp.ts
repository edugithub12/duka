import { Product } from "./types";

// Your WhatsApp business number in international format, no "+" or spaces.
// e.g. Kenya number 0712 345 678 becomes "254712345678"
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254700000000";

const TILL_NUMBER = process.env.NEXT_PUBLIC_MPESA_TILL || "000000";

export function buildOrderLink(product: Product) {
  const price = product.sale_price_kes ?? product.price_kes;
  const message = [
    `Hi, I'd like to order:`,
    `*${product.name}*`,
    `Price: KSh ${price.toLocaleString("en-KE")}`,
    ``,
    `I'll pay via M-Pesa Buy Goods Till ${TILL_NUMBER}.`,
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function tillNumber() {
  return TILL_NUMBER;
}

export function whatsappNumber() {
  return WHATSAPP_NUMBER;
}

// A general "chat with us" link for the Contact page — not tied to a
// specific product order, unlike buildOrderLink above.
export function buildGeneralWhatsAppLink(message = "Hi, I have a question.") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
