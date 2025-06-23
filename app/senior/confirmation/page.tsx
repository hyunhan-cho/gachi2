"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Ticket, CalendarDays, Users, Tag, CheckCircle2, ListChecks } from "lucide-react"

// This page is shown when a helper has found a ticket and the senior needs to confirm.
// Example data, would come from props or state
const reservationDetails = {
  teamName: "LG 트윈스",
  matchDate: "2025년 7월 15일 (화) 18:30",
  numberOfTickets: 2,
  seatType: "1루 블루석 205블록 G열 7, 8번",
  totalPrice: "56,000원",
  helperName: "김헬퍼",
}

export default function ReservationConfirmationPage() {
  const router = useRouter()
  // const requestId = useSearchParams().get("requestId"); // To identify which request this is for

  const handleConfirmSeat = () => {
    alert("좌석이 확정되었습니다! 즐거운 관람 되세요.")
    // Update request status to confirmed
    router.push("/senior/my-page")
  }

  const handleGoToRequestList = () => {
    // This might mean "request different seat" or "cancel and go back to list"
    // For now, let's assume it's a way to go back if not ready to confirm.
    router.push("/senior/my-page")
  }

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-brand-navy">티켓 예매 정보 확인</CardTitle>
          <CardDescription className="text-lg pt-2">
            <span className="font-semibold text-brand-navy-light">{reservationDetails.helperName}</span> 헬퍼님이
            찾아주신 티켓 정보입니다.
            <br /> 내용을 확인하고 좌석을 확정해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-lg">
          <div className="space-y-3 p-4 bg-sky-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Ticket className="text-brand-navy" size={24} />
              <span className="font-medium text-gray-600">응원팀:</span>
              <span className="font-semibold text-brand-navy">{reservationDetails.teamName}</span>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="text-brand-navy" size={24} />
              <span className="font-medium text-gray-600">경기일시:</span>
              <span className="font-semibold text-brand-navy">{reservationDetails.matchDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-brand-navy" size={24} />
              <span className="font-medium text-gray-600">티켓수량:</span>
              <span className="font-semibold text-brand-navy">{reservationDetails.numberOfTickets}매</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-brand-navy" size={24} /> {/* Replace with a better seat icon */}
              <span className="font-medium text-gray-600">좌석정보:</span>
              <span className="font-semibold text-brand-navy">{reservationDetails.seatType}</span>
            </div>
            <div className="flex items-center gap-3">
              <Tag className="text-brand-navy" size={24} />
              <span className="font-medium text-gray-600">총 금액:</span>
              <span className="font-semibold text-brand-navy text-xl">{reservationDetails.totalPrice}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 pt-8">
          <Button
            onClick={handleGoToRequestList}
            variant="outline"
            className="w-full sm:w-1/2 btn-touch-lg border-brand-navy text-brand-navy hover:bg-brand-sky/20 bg-white flex items-center justify-center gap-2"
          >
            <ListChecks size={22} />
            <span>요청 목록으로</span>
          </Button>
          <Button
            onClick={handleConfirmSeat}
            className="w-full sm:w-1/2 btn-touch-lg bg-brand-navy hover:bg-brand-navy-light text-white flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={22} />
            <span>이 좌석으로 확정</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
