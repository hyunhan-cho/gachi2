export interface KboTeam {
  id: string
  name: string
  shortName?: string // For placeholder images
  logoUrl?: string // Actual logo URL if available
  homeStadium?: string
}

export const KBO_TEAMS: KboTeam[] = [
  { id: "doosan", name: "두산 베어스", shortName: "두산" },
  { id: "lg", name: "LG 트윈스", shortName: "LG" },
  { id: "kt", name: "KT 위즈", shortName: "KT" },
  { id: "ssg", name: "SSG 랜더스", shortName: "SSG" },
  { id: "nc", name: "NC 다이노스", shortName: "NC" },
  { id: "kia", name: "KIA 타이거즈", shortName: "KIA" },
  { id: "lotte", name: "롯데 자이언츠", shortName: "롯데" },
  { id: "samsung", name: "삼성 라이온즈", shortName: "삼성" },
  { id: "hanwha", name: "한화 이글스", shortName: "한화" },
  { id: "kiwoom", name: "키움 히어로즈", shortName: "키움" },
]
