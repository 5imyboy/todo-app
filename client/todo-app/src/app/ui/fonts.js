import { Geist, Geist_Mono, Google_Sans_Code} from "next/font/google";

export const geistSans = Geist({
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const googleSansCode = Google_Sans_Code({
  subsets: ["latin"],
  weight: ["400"],
});
