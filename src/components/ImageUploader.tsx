import {FormControl} from "@chakra-ui/react";
import React, {useState} from "react";
import {uploadFileViaMutation} from "../hooks/useGraphQL";
import {Control, Controller, UseFormRegister, useWatch} from "react-hook-form";
import {FormValues} from "./DoctorsCrud/Form/DoctorForm";

export async function uploadFile(file: File): Promise<string> {

    return await uploadFileViaMutation(file);
}

interface ImageUploaderProps {
    control: Control<FormValues>
}

function makePreview(photo: File | string) {
    let preview = '';
    if (photo instanceof File) {
        preview = URL.createObjectURL(photo);
    } else {
        preview = photo;
    }

    return preview;
}

export default function ImageUploader({control}: ImageUploaderProps) {


    return <>
        <Controller
            control={control}
            name={'photo'}
            rules={{
                required: 'Photo is required'
            }}
            render={({field: {value, onChange, ...field}}) => {
                return (
                    <>
                        {value && <img style={{ height: '100px' }} src={makePreview(value)}/>}
                        <input
                            onChange={(event) => {
                                if (event.target.files) {
                                    onChange(event.target.files[0]);
                                }
                            }}
                            type="file"
                            id="photo"
                        />
                    </>
                )
            }}

        />


    </>
}