import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google" // Replace with a Korean font if possible
import "./globals.css"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Ticket, UserCircle } from "lucide-react" // Added UserCircle for My Page icon

// If using a specific Korean font, configure it here. For now, Inter as a fallback.
const font = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "같이가요 - KBO 티켓 예매 도우미",
  description: "어르신들을 위한 KBO 야구 티켓 예매 지원 서비스",
    generator: 'v0.dev'
}

// --- Mock Auth State ---
// For demonstration, let's assume the user is always authenticated
// and their role can be toggled here to test different My Page views.
const isAuthenticated = true // Set to true to always show "My Page" and "Logout"
const userRole = "helper" // Change to 'senior' or 'helper' to test respective My Pages
// --- End Mock Auth State ---

function SiteHeader() {
  return (
    <header className="bg-brand-navy text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Ticket size={32} className="group-hover:animate-pulse" />
          <span className="text-2xl font-bold group-hover:text-brand-sky transition-colors">같이가요</span>
        </Link>
        <nav className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link
                href={userRole === "senior" ? "/senior/my-page" : "/helper/my-page"}
                className="text-lg hover:text-brand-sky transition-colors flex items-center gap-2"
              >
                <UserCircle size={24} />
                마이페이지
              </Link>
              <button className="text-lg hover:text-brand-sky transition-colors">로그아웃</button>
            </>
          ) : (
            <Link href="/login" className="text-lg hover:text-brand-sky transition-colors">
              로그인 / 회원가입
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={cn(font.className, "min-h-screen flex flex-col")}>
        <SiteHeader />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">{children}</main>
        <footer className="bg-gray-100 text-center py-6 text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} 같이가요. 모든 권리 보유.</p>
          <p className="mt-1">어르신들의 즐거운 야구 관람을 응원합니다!</p>
        </footer>
      </body>
    </html>
  )
}
