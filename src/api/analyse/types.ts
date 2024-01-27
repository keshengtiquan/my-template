export interface Introduce {
  dailyIntroduceData: DailyIntroduceData
  monthIntroduceData: MonthIntroduceData
  yearIntroduceData: YearIntroduceData
  totalityIntroduceData: TotalityIntroduceData
}

export interface DailyIntroduceData {
  dailyOutputValue: string
  weekOutputValue: string
  weekRate: string
  dayRate: any
}

export interface MonthIntroduceData {
  data: Data
  chartData: ChartDaum[]
}

export interface Data {
  completionOutputValue: string
  planOutputValue: string
  completionRate: string
}

export interface YearIntroduceData {
  data: Data
  chartData: ChartDaum[]
}

export interface ChartDaum {
  x: string
  y: number
}



export interface TotalityIntroduceData {
  progress: number
  progressText: number
  lastProgress: string
}