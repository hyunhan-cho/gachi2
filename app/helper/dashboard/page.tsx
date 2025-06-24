"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Handshake, User, CalendarDays, Ticket } from "lucide-react"
import { useRouter } from "next/navigation"

// 1. 백엔드 데이터 구조에 맞게 인터페이스 수정
interface Team {
  id: number;
  name: string;
}

interface Game {
  id: number;
  team: Team;
  game_date: string;
  game_time: string;
}

interface SeniorUser {
  id: number;
  name: string;
}

interface HelpRequest {
  id: number; // 타입 string -> number
  user: SeniorUser;
  game: Game;
  status: string;
  request_time: string;
  // numberOfTickets 필드는 백엔드에 없으므로 일단 제외
}

export default function HelperDashboardPage() {
  const router = useRouter()
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([])

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // 로그인 시 저장한 토큰 가져오기
    if (!token) {
        alert('로그인이 필요합니다.');
        router.push('/login'); // 로그인 페이지로 리디렉션
        return;
    }

    // 2. 백엔드 API 경로에 맞게 수정 및 인증 헤더 추가
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/requests/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
      .then(res => {
        if (!res.ok) {
            throw new Error('데이터를 불러오는데 실패했습니다.');
        }
        return res.json()
      })
      .then(data => setHelpRequests(data))
      .catch((error) => {
        console.error('Error fetching help requests:', error)
        setHelpRequests([])
      })
  }, [router])

  const handleConfirmHelp = (requestId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        alert('로그인이 필요합니다.');
        router.push('/login');
        return;
    }

    // 2. 백엔드 API 경로에 맞게 수정 및 인증 헤더 추가
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/requests/${requestId}/proposal/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      // proposal 생성 시 body에 데이터가 필요하다면 추가해야 합니다.
      // 현재 ProposalCreateView는 body 없이 요청만 보내면 생성되도록 되어 있습니다.
    })
    .then(res => {
      if (!res.ok) {
        // 헬퍼가 이미 제안했거나, 다른 사람이 먼저 제안한 경우 등 에러 처리
        return res.json().then(err => { throw new Error(err.detail || '도움 제안에 실패했습니다.') });
      }
      return res.json();
    })
    .then(() => {
      alert('도움 제안이 완료되었습니다! 마이페이지에서 상세 내역을 확인하세요.');
      // 현재 페이지를 새로고침하거나, 마이페이지 등으로 이동
      router.refresh(); 
    })
    .catch((error) => {
      console.error('Error accepting help request:', error)
      alert(error.message);
    })
  }

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-brand-navy mb-8 text-center">
        도움 요청 목록
      </h2>
      {helpRequests.length > 0 ? (
        <div className="space-y-6">
          {helpRequests.map((req) => (
            <Card key={req.id} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-brand-navy-light flex items-center gap-2">
                  {/* 3. 변경된 데이터 구조에 맞게 JSX 수정 */}
                  <User size={28} /> {req.user.name}님의 요청
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-lg">
                  <Ticket className="text-brand-navy" />
                  <strong>팀:</strong> {req.game.team.name}
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <CalendarDays className="text-brand-navy" />
                  <strong>날짜:</strong> {req.game.game_date}
                </div>
                {/* 3. numberOfTickets는 없으므로 일단 주석 처리
                <div className="flex items-center gap-2 text-lg">
                  <User className="text-brand-navy" />
                  <strong>수량:</strong> {req.numberOfTickets}매
                </div>
                */}
                <div className="pt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="w-full btn-touch-lg bg-brand-navy hover:bg-brand-navy-light text-white flex items-center justify-center gap-2"
                      >
                        <Handshake size={22} />
                        <span>도움 시작하기</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>도움 요청 확인</DialogTitle>
                        <DialogDescription>
                          {req.user.name}님의 {req.game.team.name} 경기 티켓 예매를 도와드리시겠습니까?
                          <br />
                          <strong>경기 날짜:</strong> {req.game.game_date}
                          {/*<br />
                          <strong>티켓 수량:</strong> {req.numberOfTickets}매*/}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">취소</Button>
                        <Button onClick={() => handleConfirmHelp(req.id)}>
                          도움 시작하기
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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