import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from "react-hook-form";
import { StatusEnum } from "../../../gql/graphql";
import { FormValues } from "./DoctorForm";

interface DaySlotTemplatesProps {
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

export interface DaySlotTemplateValues {
  dayNumber: number;
  status: StatusEnum;
  workHours: string | null | undefined;
}

function getDaySlotDefaultValues(): DaySlotTemplateValues {
  return {
    dayNumber: 0,
    status: StatusEnum.Present,
    workHours: "",
  };
}

export default function DaySlotTemplates({
  errors,
  control,
  register,
}: DaySlotTemplatesProps) {
  console.log(errors.daySlotTemplates);
  const { fields, append, remove } = useFieldArray<FormValues>({
    control,
    name: "daySlotTemplates",
  });

  const daySlotTemplatesNodes = fields.map((daySlotTemplate, index) => {
    const itemError = errors.daySlotTemplates?.[index];
    return (
      <Tr key={daySlotTemplate.id}>
        <Td>
          <FormControl isInvalid={!!itemError?.dayNumber}>
            <Input
              type={"number"}
              {...register(`daySlotTemplates.${index}.dayNumber`, {
                valueAsNumber: true,
                required: "Day number is required",
                min: {
                  value: 1,
                  message: "Min value 1",
                },
                max: {
                  value: 7,
                  message: "Max value 7",
                },
              })}
            />

            {itemError?.dayNumber && (
              <FormErrorMessage>
                {itemError?.dayNumber?.message}
              </FormErrorMessage>
            )}
          </FormControl>
        </Td>
        <Td>
          <Select {...register(`daySlotTemplates.${index}.status`)}>
            <option value={StatusEnum.Absent}>Absent</option>
            <option value={StatusEnum.Present}>Present</option>
          </Select>
        </Td>
        <Td>
          <Input {...register(`daySlotTemplates.${index}.workHours`)} />
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
      <Table>
        <Thead>
          <Tr>
            <Th>Day number</Th>
            <Th>Status</Th>
            <Th>Work Hours</Th>
            <Th>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>{daySlotTemplatesNodes}</Tbody>
      </Table>
      <Button onClick={() => append(getDaySlotDefaultValues())}>Add</Button>
    </>
  );
}
