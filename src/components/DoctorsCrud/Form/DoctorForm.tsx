import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import { GQValidationError } from "../../../hooks/useGraphQL";
import { utilGQErrorsSetter } from "../../../support/Form";
import ImageUploader from "../../ImageUploader";
import DaySlotTemplates, { DaySlotTemplateValues } from "./DaySlotTemplates";

interface DoctorFormProps {
  doctor?: FormValues;
  action: "create" | "update";
  onSuccessSubmit: (
    formValues: FormValues,
  ) => Promise<GQValidationError | void>;
}

export type FormValues = {
  name: string;
  description: string;
  photo: string | File | null;
  daySlotTemplates: DaySlotTemplateValues[];
};

export function DoctorForm({ doctor, onSuccessSubmit }: DoctorFormProps) {
  const {
    register,
    setError,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: doctor,
  });

  async function onSubmit(formValues: FormValues) {
    const error = await onSuccessSubmit(formValues);

    if (!error) {
      return;
    }

    utilGQErrorsSetter(error, setError);
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb="10px" isInvalid={!!errors.name}>
          <Input
            placeholder="Name"
            {...register("name", {
              required: "Name is required",
            })}
          />

          {errors.name && (
            <FormErrorMessage>{errors.name.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl mb="10px" isInvalid={!!errors.description}>
          <Textarea
            placeholder="Description"
            {...register("description", {
              required: "Description is required",
            })}
          ></Textarea>
          {errors.description && (
            <FormErrorMessage>{errors.description.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl mb="10px" isInvalid={!!errors.photo}>
          <ImageUploader control={control} />
          {errors.photo && (
            <FormErrorMessage>{errors.photo.message}</FormErrorMessage>
          )}
        </FormControl>

        <Box
          style={{
            border: "1px solid var(--chakra-colors-chakra-border-color)",
            padding: "5px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <Heading>Day slot templates</Heading>
          <DaySlotTemplates
            errors={errors}
            control={control}
            register={register}
          />
        </Box>

        <FormControl>
          <Button type={"submit"}>Save</Button>
        </FormControl>
      </Form>
    </>
  );
}
