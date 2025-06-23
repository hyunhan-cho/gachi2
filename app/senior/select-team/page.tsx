"use client"

import { KBO_TEAMS, type KboTeam } from "@/components/kbo-teams"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function SelectTeamPage() {
  const router = useRouter()

  const handleTeamSelect = (team: KboTeam) => {
    // Store selected team (e.g., in state management or pass via query params)
    console.log("Selected team:", team.name)
    router.push(`/senior/select-date?teamId=${team.id}`)
  }

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-brand-navy mb-8 text-center">응원하는 KBO 팀을 선택해주세요!</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {KBO_TEAMS.map((team) => (
          <Card
            key={team.id}
            className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
            onClick={() => handleTeamSelect(team)}
          >
            <CardContent className="p-0 flex flex-col items-center justify-center aspect-square">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3">
                <Image
                  src={`/placeholder.svg?width=100&height=100&text=${team.shortName || team.name.charAt(0)}`}
                  alt={`${team.name} 로고`}
                  layout="fill"
                  objectFit="contain"
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <p className="text-lg font-semibold text-brand-navy group-hover:text-brand-navy-light text-center px-2">
                {team.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button
          variant="outline"
          size="lg"
          className="text-lg border-brand-navy text-brand-navy hover:bg-brand-sky/20"
          onClick={() => router.back()}
        >
          이전으로
        </Button>
      </div>
    </div>
  )
}
