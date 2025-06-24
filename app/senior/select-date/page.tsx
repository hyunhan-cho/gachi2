"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useState } from "react"
import { KBO_TEAMS } from "@/components/kbo-teams"

export default function SelectDatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const teamId = searchParams.get("teamId")
  
  const selectedTeam = KBO_TEAMS.find((t) => t.id === teamId)

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [accompanyingPerson, setAccompanyingPerson] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!date || !teamId) {
      alert("날짜 또는 팀 정보가 올바르지 않습니다.");
      return;
    }

    setIsSubmitting(true);

    const requestData = {
      teamId: teamId,
      gameDate: date.toISOString().split('T')[0],
      numberOfTickets: accompanyingPerson ? 2 : 1,
    };

    try {
      // --- V V V 바로 이 부분의 주소만 수정하면 됩니다 V V V ---
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/requests/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        // 백엔드에서 온 에러 메시지를 보여주면 더 좋습니다.
        const errorData = await response.json();
        throw new Error(errorData.detail || '도움 요청에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
      
      alert("도움 요청이 성공적으로 접수되었습니다.");
      router.push("/senior/my-page");

    } catch (error) {
      console.error("Submit request failed:", error);
      alert(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!selectedTeam) {
    return <p className="text-center text-xl py-10">잘못된 접근입니다. 팀을 먼저 선택해주세요.</p>
  }

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-brand-navy">경기 관람 정보 선택</CardTitle>
          <CardDescription className="text-lg pt-2">
            <span className="font-semibold text-brand-navy-light">{selectedTeam.name}</span> 경기의
            <br />
            관람을 원하시는 날짜와 동반 인원 여부를 선택해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold text-brand-navy mb-4">날짜 선택</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm p-4 bg-white"
              disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
            />
          </div>

          <div className="flex items-center justify-center space-x-3 p-4 border-t border-b">
            <Checkbox
              id="accompanying"
              checked={accompanyingPerson}
              onCheckedChange={(checked) => setAccompanyingPerson(checked as boolean)}
              className="w-6 h-6 data-[state=checked]:bg-brand-navy data-[state=checked]:border-brand-navy"
            />
            <Label htmlFor="accompanying" className="text-lg font-medium text-gray-700 cursor-pointer">
              동반 1인이 있나요? (총 2매 예매)
            </Label>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              variant="outline"
              size="lg"
              className="text-lg border-brand-navy text-brand-navy hover:bg-brand-sky/20 w-full sm:w-auto"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              이전 (팀 다시 선택)
            </Button>
            <Button
              onClick={handleSubmit}
              size="lg"
              className="text-lg bg-brand-navy hover:bg-brand-navy-light text-white w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "요청하는 중..." : "이 내용으로 도움 요청하기"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}