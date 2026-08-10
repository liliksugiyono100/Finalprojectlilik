export type Status = "Open" | "Close";

export const STATUS_UPDATE_MAX_LENGTH = 100;

export interface DefectItem {
  no: number;
  area: string;
  disiplin: string;
  defect_and_outstanding_works: string;
  permasalahan: string;
  status: Status;
  keterangan: string;
  feedback_hk: string;
  target_penyelesaian: string;
  d_o: string;
  status_update: string;
  pic: string;
  last_updated_at: string | null;
}
