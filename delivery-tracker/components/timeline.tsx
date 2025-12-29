"use client"

import { CheckCircle2, Circle } from "lucide-react"

interface TimelineEvent {
  status: string
  timestamp: string
  location: string
}

interface TimelineProps {
  timeline: TimelineEvent[]
}

export function Timeline({ timeline }: TimelineProps) {
  return (
    <div className="space-y-4">
      {timeline.map((event, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
              {index === timeline.length - 1 ? (
                <CheckCircle2 className="h-5 w-5 text-accent" />
              ) : (
                <Circle className="h-5 w-5 text-accent fill-accent" />
              )}
            </div>
            {index < timeline.length - 1 && <div className="mt-2 h-8 w-0.5 bg-accent/20" />}
          </div>
          <div className="flex-1 pt-1">
            <p className="font-semibold text-foreground">{event.status}</p>
            <p className="text-sm text-muted-foreground">{event.timestamp}</p>
            <p className="text-sm text-muted-foreground">{event.location}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
