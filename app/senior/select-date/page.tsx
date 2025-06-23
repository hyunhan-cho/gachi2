"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import React from "react"
import { KBO_TEAMS } from "@/components/kbo-teams"

export default function SelectDatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const teamId = searchParams.get("teamId")
  const selectedTeam = KBO_TEAMS.find((t) => t.id === teamId)

  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [accompanyingPerson, setAccompanyingPerson] = React.useState(false)

  const handleSubmit = () => {
    if (!date) {
      alert("날짜를 선택해주세요.")
      return
    }
    console.log("Selected date:", date, "Accompanying:", accompanyingPerson, "Team:", selectedTeam?.name)
    // Navigate to confirmation or next step
    // For now, let's assume this creates a request and goes to My Page
    // Or, it goes to a pre-confirmation screen if the prompt's "Reservation Confirmation" is before helper.
    // Given the prompt's button names for confirmation, it's likely after helper.
    // So, this step would submit a request.
    alert(
      `요청이 접수되었습니다: ${selectedTeam?.name}, ${date.toLocaleDateString()}, 동반 ${accompanyingPerson ? "1명" : "없음"}`,
    )
    router.push("/senior/my-page")
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
              disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} // Disable past dates
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
            >
              이전 (팀 다시 선택)
            </Button>
            <Button
              onClick={handleSubmit}
              size="lg"
              className="text-lg bg-brand-navy hover:bg-brand-navy-light text-white w-full sm:w-auto"
            >
              이 내용으로 도움 요청하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
