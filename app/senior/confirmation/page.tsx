"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { Ticket, CalendarDays, Users, Tag, CheckCircle2, ListChecks } from "lucide-react"
import React, { useEffect, useState } from "react"

// API 응답 데이터 타입을 정의합니다.
interface ReservationDetails {
  teamName: string;
  matchDate: string;
  numberOfTickets: number;
  seatType: string;
  totalPrice: string;
  helperName: string;
}

export default function ReservationConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. URL의 쿼리 파라미터에서 requestId를 가져옵니다.
  const requestId = searchParams.get("requestId");

  // 2. API로부터 받아온 데이터를 저장할 state와 로딩 상태를 만듭니다.
  const [reservation, setReservation] = useState<ReservationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 3. 페이지가 로드될 때 requestId를 이용해 API를 호출합니다.
  useEffect(() => {
    if (!requestId) {
      alert("잘못된 접근입니다.");
      router.push("/senior/my-page");
      return;
    }

    const fetchReservationDetails = async () => {
      try {
        // 백엔드의 특정 요청 상세 정보 API를 호출합니다 (API 경로는 예시입니다).
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/requests/${requestId}/proposal/`);
        if (!response.ok) {
          throw new Error("예매 정보를 불러오는데 실패했습니다.");
        }
        const data = await response.json();
        setReservation(data);
      } catch (error) {
        console.error(error);
        alert("예매 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservationDetails();
  }, [requestId, router]);


  // 4. 좌석 확정 시, 백엔드에 API 요청을 보냅니다.
  const handleConfirmSeat = async () => {
    if (!requestId) return;

    try {
      // 백엔드의 좌석 확정 API를 호출합니다.
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/requests/${requestId}/confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 필요하다면 인증 토큰을 추가합니다.
          // 'Authorization': `Bearer ${accessToken}`
        },
      });

      if (!response.ok) {
        throw new Error("좌석 확정에 실패했습니다.");
      }

      alert("좌석이 확정되었습니다! 즐거운 관람 되세요.");
      router.push("/senior/my-page");
    } catch (error) {
      console.error(error);
      alert("좌석 확정 중 오류가 발생했습니다.");
    }
  };

  const handleGoToRequestList = () => {
    router.push("/senior/my-page");
  };

  // 로딩 중일 때 보여줄 화면
  if (isLoading) {
    return <div className="text-center py-10">예매 정보를 불러오는 중입니다...</div>;
  }

  // 데이터가 없을 때
  if (!reservation) {
    return <div className="text-center py-10">예매 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-brand-navy">티켓 예매 정보 확인</CardTitle>
          <CardDescription className="text-lg pt-2">
            {/* 5. API로 받아온 실제 데이터(reservation)를 사용합니다. */}
            <span className="font-semibold text-brand-navy-light">{reservation.helperName}</span> 헬퍼님이
            찾아주신 티켓 정보입니다.
            <br /> 내용을 확인하고 좌석을 확정해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-lg">
          <div className="space-y-3 p-4 bg-sky-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Ticket className="text-brand-navy" size={24} />
              <span className="font-medium text-gray-600">응원팀:</span>
              <span className="font-semibold text-brand-navy">{reservation.teamName}</span>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="text-brand-navy" size={24} />
              <span className="font-medium text-gray-600">경기일시:</span>
              <span className="font-semibold text-brand-navy">{reservation.matchDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-brand-navy" size={24} />
              <span className="font-medium text-gray-600">티켓수량:</span>
              <span className="font-semibold text-brand-navy">{reservation.numberOfTickets}매</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-brand-navy" size={24} />
              <span className="font-medium text-gray-600">좌석정보:</span>
              <span className="font-semibold text-brand-navy">{reservation.seatType}</span>
            </div>
            <div className="flex items-center gap-3">
              <Tag className="text-brand-navy" size={24} />
              <span className="font-medium text-gray-600">총 금액:</span>
              <span className="font-semibold text-brand-navy text-xl">{reservation.totalPrice}</span>
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