import { DaySlotTemplateInput } from "../../gql/graphql";
import { DaySlotTemplateValues } from "./Form/DaySlotTemplates";

export function transformDaySlotTemplatesValuesToInput(
  values: DaySlotTemplateValues,
): DaySlotTemplateInput {
  return {
    dayNumber: values.dayNumber,
    status: values.status,
    workHours: values.workHours,
  };
}
