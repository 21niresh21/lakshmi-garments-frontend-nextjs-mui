import { LuPackageOpen } from "react-icons/lu";
import { GiCardDiscard } from "react-icons/gi";
import { BsHourglassSplit } from "react-icons/bs";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { AiOutlineFileDone } from "react-icons/ai";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { FaUserClock } from "react-icons/fa";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

/**
 * Timeline stages coming from backend
 */
export enum BatchTimelineStage {
  CREATED = "CREATED",
  DISCARDED = "DISCARDED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  PENDING_RETURN = "PENDING_RETURN",
  SUBMITTED = "SUBMITTED",
  AWAITING_APPROVAL = "AWAITING_APPROVAL",
  REASSIGNED = "REASSIGNED",
  AWAITING_CLOSE = "AWAITING_CLOSE",
  CLOSED = "CLOSED",
}

/**
 * MUI TimelineDot color mapping
 */
export const BatchTimelineStageColorMap: Record<
  BatchTimelineStage,
  "info" | "error" | "primary" | "secondary"
> = {
  [BatchTimelineStage.CREATED]: "primary",
  [BatchTimelineStage.DISCARDED]: "error",
  [BatchTimelineStage.IN_PROGRESS]: "primary",
  [BatchTimelineStage.COMPLETED]: "primary",
  [BatchTimelineStage.PENDING_RETURN]: "primary",
  [BatchTimelineStage.SUBMITTED]: "primary",
  [BatchTimelineStage.AWAITING_APPROVAL]: "primary",
  [BatchTimelineStage.REASSIGNED]: "secondary",
  [BatchTimelineStage.AWAITING_CLOSE]: "info",
  [BatchTimelineStage.CLOSED]: "primary",
};

/**
 * Icon mapping for each stage
 */
export const BatchTimelineStageIconMap: Record<
  BatchTimelineStage,
  React.ElementType
> = {
  [BatchTimelineStage.CREATED]: LuPackageOpen,
  [BatchTimelineStage.DISCARDED]: GiCardDiscard,
  [BatchTimelineStage.IN_PROGRESS]: BsHourglassSplit,
  [BatchTimelineStage.COMPLETED]: PendingActionsIcon,
  [BatchTimelineStage.PENDING_RETURN]: AiOutlineFileDone,
  [BatchTimelineStage.SUBMITTED]: AssignmentTurnedInIcon,
  [BatchTimelineStage.AWAITING_APPROVAL]: AssignmentTurnedInIcon,
  [BatchTimelineStage.REASSIGNED]: SwapHorizIcon,
  [BatchTimelineStage.AWAITING_CLOSE]: FaUserClock,
  [BatchTimelineStage.CLOSED]: CheckCircleIcon,
};
