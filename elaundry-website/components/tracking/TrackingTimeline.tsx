"use client";

import React from "react";
import { CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TimelineItem = {
  status: string;
  time?: string;
  completed?: boolean;
  note?: string;
};

export type TrackingTimelineProps = {
  timeline: TimelineItem[];
  title?: string;
};

export default function TrackingTimeline({ timeline, title = "Delivery Timeline" }: TrackingTimelineProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No timeline available.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <ol className="relative border-l border-border ml-2">
          {timeline.map((item, idx) => {
            const isCompleted = Boolean(item.completed);
            const isLast = idx === timeline.length - 1;
            return (
              <li key={idx} className="mb-6 ml-6 last:mb-0">
                <span
                  className={`absolute -left-3 mt-1 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-background ${
                    isCompleted ? "bg-green-500 text-white" : "bg-white text-muted-foreground border border-border"
                  }`}
                  aria-hidden
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </span>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className={`text-sm font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                      {item.status}
                    </p>
                    {item.note && <p className="text-xs text-muted-foreground mt-1">{item.note}</p>}
                  </div>

                  <div className="text-xs text-muted-foreground">{item.time ?? (isCompleted ? "Completed" : "Pending")}</div>
                </div>

                {!isLast && <div className="sr-only">Next: {timeline[idx + 1]?.status}</div>}
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
