import { StatusEnum } from "../../gql/graphql";

export interface DaySlotTemplateModel {
  id: string | undefined;
  dayNumber: number;
  status: StatusEnum;
  workHours: string | null | undefined;
}

export interface DoctorModel {
  name: string;
  description: string;
  photo: string | File;
  daySlotTemplates: DaySlotTemplateModel[];
}
