import type { CandidateStatus, InterviewStatus, JobStatus } from "@/lib/types";
import Chip from "@mui/material/Chip";

import { softBadgeColors } from "@/lib/soft-ui";

type BadgeStatus = CandidateStatus | JobStatus | InterviewStatus;

const STATUS_BADGE: Record<BadgeStatus, keyof typeof softBadgeColors> = {
  applied: "info",
  form_submitted: "primary",
  interview_scheduled: "warning",
  offer_sent: "secondary",
  hired: "success",
  rejected: "error",
  open: "success",
  closed: "dark",
  scheduled: "warning",
  completed: "success",
};

export function StatusBadge({ status }: { status: BadgeStatus }) {
  const label = status.replace(/_/g, " ");
  const key = STATUS_BADGE[status];
  const style = softBadgeColors[key];

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: style.background,
        color: style.text,
        textTransform: "capitalize",
      }}
    />
  );
}
