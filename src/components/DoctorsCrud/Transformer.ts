import {DaySlotTemplateValues} from "./Form/DaySlotTemplates";
import {DaySlotTemplateInput, GetDoctorByIdQuery} from "../../gql/graphql";

export function transformDaySlotTemplatesValuesToInput(values: DaySlotTemplateValues): DaySlotTemplateInput {
    return {
        dayNumber: values.dayNumber,
        status: values.status,
        workHours: values.workHours
    };
}

