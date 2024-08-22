import {Control, Controller, FieldValues} from "react-hook-form";
import {FieldPath} from "react-hook-form/dist/types";
import DoctorSelector from "../DoctorSelector";
import {FragmentType} from "../../gql";

export default function DoctorSelectorControlled<T extends FieldValues, TName extends FieldPath<T> = FieldPath<T>>(props: {
    control: Control<T>
    doctors: any,
    name: TName
}) {

    return <Controller
        control={props.control}
        render={({field: {value, onChange}})=>{
            return <DoctorSelector
                selectedId={value}
                doctors={props.doctors}
                onChange={(id)=>onChange(id)}
            />
        }}
        name={props.name}

    />
}