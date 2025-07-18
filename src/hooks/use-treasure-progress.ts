import { useEffect, useState } from 'react'
import { useAuth } from './use-auth'

interface TreasureProgress {
  treasuresFound: number
  completionPercentage: number
  totalTreasures: number
}

export function useTreasureProgress() {
  const [progress, setProgress] = useState<TreasureProgress>({
    treasuresFound: 0,
    completionPercentage: 0,
    totalTreasures: 25
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
        const response = await fetch('/api/treasure-progress')
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
  }, [session])

  return { progress, isLoading }
}