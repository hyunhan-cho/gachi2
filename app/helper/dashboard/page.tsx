"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Handshake, User, CalendarDays, Ticket } from "lucide-react"
import { useRouter } from "next/navigation"

interface HelpRequest {
  id: string
  seniorFanName: string // Or nickname for privacy
  teamName: string
  gameDate: string
  numberOfTickets: number
}

const mockHelpRequests: HelpRequest[] = [
  { id: "hr1", seniorFanName: "김 어르신", teamName: "LG 트윈스", gameDate: "2025년 7월 15일", numberOfTickets: 2 },
  { id: "hr2", seniorFanName: "박 할머니", teamName: "두산 베어스", gameDate: "2025년 7월 20일", numberOfTickets: 1 },
  { id: "hr3", seniorFanName: "이 선생님", teamName: "KT 위즈", gameDate: "2025년 7월 18일", numberOfTickets: 1 },
]

const Users = User // Declare the Users variable

export default function HelperDashboardPage() {
  const router = useRouter() // Initialize router

  const handleStartHelping = (requestId: string) => {
    // Navigate to the detailed request page
    router.push(`/helper/request/${requestId}`)
  }

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-brand-navy mb-8 text-center">도움이 필요한 요청 목록</h2>
      {mockHelpRequests.length > 0 ? (
        <div className="space-y-6">
          {mockHelpRequests.map((req) => (
            <Card key={req.id} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-brand-navy-light flex items-center gap-2">
                  <User size={28} /> {req.seniorFanName}님의 요청
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-lg">
                  <Ticket className="text-brand-navy" />
                  <strong>팀:</strong> {req.teamName}
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <CalendarDays className="text-brand-navy" />
                  <strong>날짜:</strong> {req.gameDate}
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <Users className="text-brand-navy" />
                  <strong>수량:</strong> {req.numberOfTickets}매
                </div>
                <div className="pt-4">
                  <Button
                    onClick={() => handleStartHelping(req.id)}
                    size="lg"
                    className="w-full btn-touch-lg bg-brand-navy hover:bg-brand-navy-light text-white flex items-center justify-center gap-2"
                  >
                    <Handshake size={22} />
                    <span>도움 시작하기</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-xl text-gray-600 text-center py-10 bg-gray-50 rounded-md">
          현재 도움이 필요한 요청이 없습니다. 감사합니다!
        </p>
      )}
    </div>
  )
}
