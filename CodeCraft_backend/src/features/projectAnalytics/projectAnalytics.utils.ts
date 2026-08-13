import { statisticsPeriodMap } from "./projectAnalytics.constants"

export function getDateRange(range: keyof typeof statisticsPeriodMap = '7d') {
  
  const endDate = new Date()
  endDate.setHours(0, 0, 0, 0)

  const startDate = new Date()
  startDate.setHours(0, 0, 0, 0)

  startDate.setDate(endDate.getDate() - statisticsPeriodMap[range])

  return {
    startDate,
    endDate
  }
}