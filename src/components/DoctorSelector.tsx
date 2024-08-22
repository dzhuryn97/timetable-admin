import {FragmentType, graphql, useFragment} from "../gql";
import React, {ChangeEvent, useState} from "react";
import {Box, FormControl, Input, Select} from "@chakra-ui/react";
import {useGraphQL} from "../hooks/useGraphQL";


const DoctorSelectorDoctor = graphql(`
    fragment  DoctorSelectorDoctor on Doctor{
        id,
        name
    }
`)

interface DoctorSelectorProps{
    doctors?: FragmentType<typeof DoctorSelectorDoctor>[]
    selectedId?: string | null
    onChange?: (id: string|null) => void
}
export default function DoctorSelector(props: DoctorSelectorProps){

    const doctors = useFragment(DoctorSelectorDoctor, props.doctors);

    if(!doctors){
        return  <></>
    }

    function handleOnChange(e: ChangeEvent<HTMLSelectElement>){
        if(props.onChange){
            props.onChange(e.target.value?e.target.value:null)
        }
    }

    return <Box>
        <Select defaultValue={props.selectedId ?? ''}
            onChange={handleOnChange}
        >
            <option>------</option>
            {doctors.map(function (doctor, index){
                return <option key={index} value={doctor.id}>{doctor.name}</option>
            })}
        </Select>
    </Box>
}