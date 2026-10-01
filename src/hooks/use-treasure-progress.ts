import { useEffect, useState } from 'react'
import { useAuth } from './use-auth'
import { CURRENT_HUNT_YEAR } from '@/lib/treasure-hunt-config'

interface TreasureProgress {
  treasuresFound: number
  completionPercentage: number
  totalTreasures: number
}

export function useTreasureProgress(year = CURRENT_HUNT_YEAR) {
  const [progress, setProgress] = useState<TreasureProgress>({
    treasuresFound: 0,
    completionPercentage: 0,
    totalTreasures: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useAuth()

  useEffect(() => {
    async function fetchProgress() {
      if (!session?.user) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/treasure-progress?year=${year}`)
        if (response.ok) {
          const data = await response.json()
          setProgress(data)
        }
      } catch (error) {
        console.error('Error fetching treasure progress:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgress()
  }, [session, year])

  return { progress, isLoading }
}