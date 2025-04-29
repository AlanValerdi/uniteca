import { Badge } from "@/components/ui/badge"

type LoanStatus = "pending" | "approved" | "rejected" | "returned"

interface LoanStatusBadgeProps {
  status: LoanStatus
}

export function LoanStatusBadge({ status }: LoanStatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Pending
        </Badge>
      )
    case "approved":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Approved
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Rejected
        </Badge>
      )
    case "returned":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Returned
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
