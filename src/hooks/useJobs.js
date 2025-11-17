import { useMemo, useState } from 'react'

import jobsDatabase from '@/data/jobsDatabase'

export function useJobs() {
  const jobs = jobsDatabase
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id ?? null)

  const activeJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) ?? null, [jobs, selectedJobId])

  return {
    jobs,
    activeJob,
    selectJob: setSelectedJobId,
    clearSelection: () => setSelectedJobId(null),
  }
}
