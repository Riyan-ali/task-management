import { DM_Sans, Domine, Nunito } from "next/font/google"

// Heading font
export const dmsans = DM_Sans({
    weight: ["100","200","300","400","500","600","700","800","900","1000"],
    subsets: ["latin"],
    display: "swap",
})

// Paragraph and text font
export const nunito = Nunito({
    weight: ["200","300","400","500","600","700","800","900","1000"],
    subsets: ["latin"],
    display: "swap",
})

// Buttons and other font
export const domine = Domine({
    weight: ["400","500","600","700"],
    subsets: ["latin"],
    display: "swap",
})