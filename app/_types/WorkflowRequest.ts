import { WorkflowRequestStatus } from "./WorkflowRequestStatus";
import { WorkflowRequestType } from "./WorkflowRequestType";

export interface WorkflowRequest {
  id: number;
  requestType: WorkflowRequestType;
  requestStatus: WorkflowRequestStatus;
  requestedBy: string;
  requestedAt: string;
  systemComments: string;
}

// types/workflowRequest.ts
export type Damage = {
  type: string;
  quantity: number;
};

export type WorkflowPayloadItem = {
  id: string;
  itemId: number;
  itemName: string;
  wage: number;
  purchasedQuantity: number;
  purchaseCost: number;
  returnedQuantity: number;
  damages: Damage[];
  jobworkNumber?: string;
  items?: any;
};

export type WorkflowRequestDetails = {
  id: number;
  requestType: string;
  requestStatus: string;
  requestedBy: string;
  requestedAt: string;
  systemComments: string | null;
  payload: WorkflowPayloadItem;
};
