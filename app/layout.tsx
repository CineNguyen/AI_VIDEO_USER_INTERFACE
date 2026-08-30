import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata={title:"AI Video Agent",description:"Create YouTube videos with AI"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body>{children}</body></html>}