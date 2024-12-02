import {
    Box,
    Button,
    Input,
    Select,
    Stack,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useLoaderData, useParams } from "react-router-dom";
import { InsertFromTemplate } from "../../components/DoctorsCrud/DaySlots/InsertFromTemplate";
import MonthSelector, {
  GetCurrentOption,
  SelectMonthOption,
} from "../../components/DoctorsCrud/DaySlots/MonthSelector";
import {
  useDispatchErrorNotification,
  useDispatchSuccessNotification,
} from "../../components/NotificationShower";
import DoctorSelectorControlled from "../../components/ReactForm/DoctorSelectorControlled";
import SingleDatepickerControlled from "../../components/ReactForm/SingleDatepickerControlled";
import { graphql } from "../../gql";
import {
  DaySlotEditQueryQuery,
  DaySlotInput,
  StatusEnum,
} from "../../gql/graphql";
import { executeQuery } from "../../hooks/useGraphQL";
import { FormatDate, ParseDate } from "../../support/Date";
import {Label} from "@tanstack/react-query-devtools/build/lib/Explorer";

export interface FormValues {
  daySlots: DaySlotValues[];
}

export interface DaySlotValues {
  date: Date;
  status: StatusEnum;
  workHours?: string | null;
  absentReason?: string | null;
  replacement?: string | null;
}

function getDaySlotDefaultValues(date: Date = new Date()): DaySlotValues {
  return {
    date: date,
    status: StatusEnum.Present,
  };
}

const daySlotQuery = graphql(`
  query DaySlotEditQuery(
    $doctorId: ID!
    $month: Int!
    $year: Int!
    $loadExtra: Boolean!
  ) {
    doctor(id: $doctorId) {
      daySlots(month: $month, year: $year) {
        id
        date
        status
        workHours
        absentReason
        replacement {
          id
        }
      }
      daySlotTemplates @include(if: $loadExtra) {
        ...InsertFromTemplate_DoctorTemplateFragment
      }
    }
    allDoctors: doctors @include(if: $loadExtra) {
      ...DoctorSelectorDoctor
    }
  }
`);

const UpdateMonthDaySlotsMutation = graphql(`
  mutation UpdateMonthDaySlots(
    $month: Int!
    $year: Int!
    $doctorId: ID!
    $daySlots: [DaySlotInput!]
  ) {
    updateDaySlots(
      input: {
        month: $month
        year: $year
        doctorId: $doctorId
        daySlots: $daySlots
      }
    ) {
      id
    }
  }
`);

export async function loadData(
  doctorId: string,
  month: SelectMonthOption = GetCurrentOption(),
  loadExtraData: boolean = true,
) {
  return await executeQuery(daySlotQuery, {
    doctorId: doctorId,
    month: month.month,
    year: month.year,
    loadExtra: loadExtraData,
  });
}

function transformResponseToDaySlotValues(
  inputDaySlots: DaySlotEditQueryQuery["doctor"]["daySlots"],
) {
  const daySlots: DaySlotValues[] = [];
  inputDaySlots.forEach(function (daySlot) {
    daySlots.push({
      date: ParseDate(daySlot.date),
      status: daySlot.status,
      workHours: daySlot.workHours,
      absentReason: daySlot.absentReason,
      replacement: daySlot.replacement ? daySlot.replacement.id : null,
    });
  });

  return daySlots;
}

export default function DaySlotsEditing() {
  const loadedData = useLoaderData() as DaySlotEditQueryQuery;
  const params = useParams();
  const doctorId: string = params["id"] as string;
  const [selectedMonth, setSelectedMonth] = useState(GetCurrentOption());

  const successNotificationDispatcher = useDispatchSuccessNotification();
  const errorNotificationDispatcher = useDispatchErrorNotification();

  const { register, control, getValues, setValue, reset, handleSubmit } =
    useForm<FormValues>({
      defaultValues: {
        daySlots: transformResponseToDaySlotValues(loadedData.doctor.daySlots),
      },
    });

  const { fields, append, insert, remove } = useFieldArray({
    control,
    name: "daySlots",
  });

  async function handleSelectMonth(month: SelectMonthOption) {
    setSelectedMonth(month);

    const response = await loadData(doctorId, month, false);

    if (response.data.doctor) {
      reset({
        daySlots: transformResponseToDaySlotValues(
          response.data.doctor.daySlots,
        ),
      });
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const response = await executeQuery(UpdateMonthDaySlotsMutation, {
      month: selectedMonth.month,
      year: selectedMonth.year,
      doctorId: doctorId,
      daySlots: data.daySlots.map(function (
        daySlot: DaySlotValues,
      ): DaySlotInput {
        return {
          date: FormatDate(daySlot.date),
          status: daySlot.status,
          workHours: daySlot.workHours,
          absentReason: daySlot.absentReason,
          replacement: daySlot.replacement
            ? {
                connect: daySlot.replacement,
              }
            : null,
        };
      }),
    });

    if (response.data.updateDaySlots) {
      successNotificationDispatcher("Updated");
      return;
    }

    errorNotificationDispatcher("Error");
  };

  const daySlotNodes = fields.map(function (daySlot, index) {
    function insertDaySlot(index: number) {
      const values = getValues("daySlots");
      const value = values[index];

      const prevDate = value.date;

      const nextDate = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth(),
        prevDate.getDate() + 1,
      );
      console.log(nextDate);

      insert(index + 1, getDaySlotDefaultValues(nextDate));
    }

    return (
      <Tr key={daySlot.id}>
        <Td>
          <SingleDatepickerControlled<FormValues>
            control={control}
            name={`daySlots.${index}.date`}
          />
        </Td>
        <Td>
          <Select {...register(`daySlots.${index}.status`)}>
            <option value={StatusEnum.Absent}>Absent</option>
            <option value={StatusEnum.Present}>Present</option>
          </Select>
        </Td>
        <Td>
          {daySlot.status === StatusEnum.Present && (
            <Input
              placeholder={"Work hours"}
              {...register(`daySlots.${index}.workHours`)}
            />
          )}

          {daySlot.status === StatusEnum.Absent && (
            <Input
              placeholder={"Absent reason"}
              {...register(`daySlots.${index}.absentReason`)}
            />
          )}
        </Td>
        <Td>
          {daySlot.status === StatusEnum.Absent && (
            <DoctorSelectorControlled<FormValues>
              doctors={[]}
              control={control}
              name={`daySlots.${index}.replacement`}
            />
          )}
        </Td>
        <Td>
          <Button colorScheme={"green"} onClick={() => insertDaySlot(index)}>
            +
          </Button>
        </Td>
        <Td>
          <Button colorScheme={"red"} onClick={() => remove(index)}>
            -
          </Button>
        </Td>
      </Tr>
    );
  });

  return (
    <>
      <Stack direction={"row"} padding={"0 0 0 1.5rem"} >
          <Box alignContent={"center"} fontWeight={"bold"}>Month: </Box>
          <MonthSelector
              previousMonthCount={3}
              nextMonthCount={6}
              selectedMonth={selectedMonth}
              onSelectMonth={handleSelectMonth}
          />
      </Stack>

      <Table>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Status</Th>
            <Th>Work Hours/Absent reason</Th>
            <Th>Replacement</Th>
            <Th>Add</Th>
            <Th>Remove</Th>
          </Tr>
        </Thead>
        <Tbody>{daySlotNodes}</Tbody>
      </Table>

      <Stack marginTop={"10px"} direction="row" justifyContent={"end"}>
        {fields.length === 0 && (
          <>
            <Button onClick={() => append(getDaySlotDefaultValues())}>
              Add
            </Button>

            {loadedData.doctor.daySlotTemplates && (
              <InsertFromTemplate
                selectedMonth={selectedMonth}
                daySlotTemplates={loadedData.doctor.daySlotTemplates}
                reset={reset}
              />
            )}
          </>
        )}

        <Button colorScheme={"green"} onClick={handleSubmit(onSubmit)}>
          Save
        </Button>
      </Stack>
    </>
  );
}
