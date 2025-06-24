"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  AlertCircle,
  CheckCircle2,
  Hourglass,
  RefreshCw,
  TicketIcon,
  CalendarDays,
  UsersIcon,
  UserCircle,
} from "lucide-react"
import React, { useEffect, useState } from "react" // useEffect, useState 추가

// API로부터 받아올 데이터의 타입을 정의합니다.
type RequestStatus =
  | "WAITING_FOR_HELPER"
  | "HELPER_MATCHED"
  | "TICKET_PROPOSED"
  | "SEAT_CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"

interface ReservationRequest {
  id: string
  teamName: string
  matchDate: string
  numberOfTickets: number
  status: RequestStatus
  statusText: string
  actionLink?: string
  actionText?: string
  helperName?: string
}

// Status에 따라 아이콘을 렌더링하는 컴포넌트 (이전과 동일)
function StatusIcon({ status }: { status: RequestStatus }) {
  switch (status) {
    case "WAITING_FOR_HELPER":
      return <Hourglass className="text-yellow-600" size={32} />
    case "HELPER_MATCHED":
      return <RefreshCw className="text-blue-600 animate-spin" size={32} />
    case "TICKET_PROPOSED":
      return <AlertCircle className="text-orange-500" size={32} />
    case "SEAT_CONFIRMED":
    case "COMPLETED":
      return <CheckCircle2 className="text-green-600" size={32} />
    case "CANCELLED":
      return <AlertCircle className="text-red-600" size={32} />
    default:
      return <Hourglass className="text-gray-500" size={32} />
  }
}

export default function SeniorMyPage() {
  // 1. API로부터 받아온 데이터를 저장할 state들을 만듭니다.
  const [currentRequests, setCurrentRequests] = useState<ReservationRequest[]>([]);
  const [pastRequests, setPastRequests] = useState<ReservationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. 페이지가 로드될 때, 나의 요청 목록 API를 호출합니다.
  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/requests/my/`, {
          headers: {
            // 로그인된 사용자의 요청이므로 인증 토큰이 필요합니다.
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // 예시: localStorage에서 토큰 가져오기
          }
        });

        if (!response.ok) {
          throw new Error("요청 목록을 불러오는데 실패했습니다.");
        }
        
        // 백엔드에서 currentRequests와 pastRequests를 구분해서 보내준다고 가정합니다.
        const data = await response.json();
        setCurrentRequests(data.currentRequests || []);
        setPastRequests(data.pastRequests || []);

      } catch (error) {
        console.error("Failed to fetch requests:", error);
        alert("요청 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyRequests();
  }, []); // 빈 배열을 전달하여 한 번만 실행되도록 합니다.


  // 3. 로딩 중일 때 표시할 UI
  if (isLoading) {
    return <div className="text-center py-10">요청 현황을 불러오는 중입니다...</div>;
  }

  return (
    <div className="py-8">
      <header className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-brand-navy">나의 예매 요청 현황</h2>
        <p className="text-xl text-gray-600 mt-2">야구 경기 예매 요청 상태를 확인하세요.</p>
      </header>

      {/* 이하의 JSX 코드는 state(currentRequests, pastRequests)를 사용하도록 변경되었을 뿐, 구조는 동일합니다. */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold text-brand-navy mb-6">현재 진행 중인 요청</h3>
        {currentRequests.length > 0 ? (
          <div className="space-y-6">
            {currentRequests.map((req) => (
              <Card key={req.id} className="shadow-lg overflow-hidden">
                <CardHeader
                  className={`p-5 ${
                    req.status === "TICKET_PROPOSED"
                      ? "bg-orange-50"
                      : req.status === "SEAT_CONFIRMED"
                        ? "bg-green-50"
                        : "bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle className="text-2xl text-brand-navy-light mb-1">{req.teamName}</CardTitle>
                      <div className="text-md text-gray-700 space-y-1">
                        <p className="flex items-center gap-2">
                          <CalendarDays size={18} /> {req.matchDate}
                        </p>
                        <p className="flex items-center gap-2">
                          <UsersIcon size={18} /> {req.numberOfTickets}매
                        </p>
                        {req.helperName && (
                          <p className="flex items-center gap-2">
                            <UserCircle size={18} /> 담당 헬퍼: {req.helperName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <StatusIcon status={req.status} />
                      <p
                        className={`mt-1 text-sm font-semibold ${
                          req.status === "TICKET_PROPOSED"
                            ? "text-orange-600"
                            : req.status === "WAITING_FOR_HELPER"
                              ? "text-yellow-700"
                              : req.status === "HELPER_MATCHED"
                                ? "text-blue-700"
                                : req.status === "SEAT_CONFIRMED"
                                  ? "text-green-700"
                                  : "text-gray-700"
                        }`}
                      >
                        {req.statusText}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                {req.actionLink && req.actionText && (
                  <CardContent className="p-5 border-t">
                    <Link href={req.actionLink} passHref>
                      <Button
                        size="lg"
                        className={`w-full btn-touch-lg text-lg ${
                          req.status === "TICKET_PROPOSED"
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-brand-navy hover:bg-brand-navy-light"
                        } text-white`}
                      >
                        {req.actionText}
                      </Button>
                    </Link>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-8 text-center">
              <TicketIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">현재 진행 중인 요청이 없습니다.</p>
              <p className="text-md text-gray-500 mt-1">새로운 경기를 보러 가고 싶으시면 아래 버튼을 눌러주세요.</p>
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <h3 className="text-2xl font-semibold text-brand-navy mb-6">지난 요청 내역</h3>
        {pastRequests.length > 0 ? (
          <div className="space-y-4">
            {pastRequests.map((req) => (
              <Card key={req.id} className="shadow-md bg-gray-100">
                <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <p className="text-xl font-semibold text-gray-800">{req.teamName}</p>
                    <p className="text-md text-gray-600">
                      {req.matchDate} / {req.numberOfTickets}매
                    </p>
                    {req.helperName && <p className="text-sm text-gray-500">도움주신 헬퍼: {req.helperName}</p>}
                  </div>
                  <Badge
                    className={`text-md px-4 py-1.5 mt-2 sm:mt-0 ${req.status === "COMPLETED" ? "bg-green-600" : "bg-red-600"} text-white`}
                  >
                    {req.statusText}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-8 text-center">
              <CalendarDays size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">지난 요청 내역이 없습니다.</p>
            </CardContent>
          </Card>
        )}
      </section>
      <div className="mt-16 text-center">
        <Link href="/senior/select-team" passHref>
          <Button
            size="lg"
            className="btn-touch-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xl px-10 py-6"
          >
            새로운 경기 예매 요청하기
          </Button>
        </Link>
      </div>
    </div>
  )
}