import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useJobs } from '@/hooks/useJobs'

export default function JobDetails() {
  const { activeJob } = useJobs()

  if (!activeJob) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-text-tertiary">
          Select a job to view its requirements, schedule, and rewards.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{activeJob.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-text-secondary">
        <p>Category: {activeJob.category}</p>
        <p>Difficulty: {activeJob.difficulty}</p>
        <p>Mini-game: {activeJob.miniGame}</p>
        <p>Pay per session: ${activeJob.payPerSession}</p>
        <p>Available in eras: {activeJob.eraAvailability.join(', ')}</p>
      </CardContent>
    </Card>
  )
}
