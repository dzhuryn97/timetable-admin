import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Control, Controller, FieldValues } from "react-hook-form";
import { FieldPath } from "react-hook-form/dist/types";

export default function SingleDatepickerControlled<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>(props: { control: Control<T>; name: TName }) {
  return (
    <Controller
      control={props.control}
      render={({ field: { value, onChange } }) => {
        return <SingleDatepicker date={value} onDateChange={onChange} />;
      }}
      name={props.name}
    />
  );
}
