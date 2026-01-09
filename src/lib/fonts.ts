import { Lexend, Noto_Sans_KR } from "next/font/google";

export const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
