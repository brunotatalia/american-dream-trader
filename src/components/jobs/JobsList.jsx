import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useJobs } from '@/hooks/useJobs'

export default function JobsList() {
  const { jobs } = useJobs()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Jobs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="rounded-lg border border-white/5 bg-background-tertiary/50 px-4 py-3">
            <p className="font-semibold text-text-primary">{job.title}</p>
            <p className="text-sm text-text-tertiary">Difficulty: {job.difficulty}</p>
            <p className="text-sm text-text-tertiary">Pay per session: ${job.payPerSession}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
