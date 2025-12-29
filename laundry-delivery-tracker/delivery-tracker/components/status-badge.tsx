"use client"

interface StatusBadgeProps {
  status: "pending" | "picked-up" | "in-transit" | "out-for-delivery" | "delivered"
}

const statusConfig = {
  pending: { label: "Pending", className: "bg-muted text-muted-foreground" },
  "picked-up": { label: "Picked Up", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  "in-transit": {
    label: "In Transit",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  "out-for-delivery": {
    label: "Out for Delivery",
    className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  delivered: { label: "Delivered", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  )
}
