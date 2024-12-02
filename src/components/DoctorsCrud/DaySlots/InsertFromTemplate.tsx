import { Button } from "@chakra-ui/react";
import { FieldValues, UseFormReset } from "react-hook-form";
import { FragmentType, graphql, useFragment } from "../../../gql";
import { InsertFromTemplate_DoctorTemplateFragmentFragment } from "../../../gql/graphql";
import {
  DaySlotValues,
  FormValues,
} from "../../../pages/Doctor/DaySlotsEditing";
import { GetDaysInMonth, ParseDate } from "../../../support/Date";
import { SelectMonthOption } from "./MonthSelector";

const fragment = graphql(`
  fragment InsertFromTemplate_DoctorTemplateFragment on DaySlotTemplate {
    id
    dayNumber
    status
    workHours
  }
`);

export function InsertFromTemplate<T extends FieldValues>(props: {
  daySlotTemplates: FragmentType<typeof fragment>[];
  selectedMonth: SelectMonthOption;
  reset: UseFormReset<FormValues>;
}) {
  const daySlotTemplates = useFragment(fragment, props.daySlotTemplates);
  const selectedMonth = props.selectedMonth;
  //
  function findDaySlotTemplateByDayNumber<T>(
    dayNumber: number,
  ): InsertFromTemplate_DoctorTemplateFragmentFragment | null {
    for (let i = 0; i < daySlotTemplates.length; i++) {
      const daySlotTemplate = daySlotTemplates[i];

      if (daySlotTemplate.dayNumber === dayNumber) {
        return daySlotTemplate;
      }
    }

    return null;
  }

  function handleInsertFromTemplate() {
    let date = ParseDate(selectedMonth.year + "-" + selectedMonth.month + "-1");

    const daySlots: DaySlotValues[] = [];
    for (
      let i = 1;
      i <= GetDaysInMonth(selectedMonth.month, selectedMonth.year);
      i++
    ) {
      const daySlotTemplate = findDaySlotTemplateByDayNumber(date.getDay());

      if (daySlotTemplate) {
        daySlots.push({
          date: date,
          status: daySlotTemplate.status,
          workHours: daySlotTemplate.workHours,
        });
      }
      date = new Date(date.getTime());
      date.setDate(date.getDate() + 1);
    }

    props.reset({
      daySlots: daySlots,
    });
  }

  return (
    <Button onClick={() => handleInsertFromTemplate()} colorScheme="teal">
      Insert from template
    </Button>
  );
}
