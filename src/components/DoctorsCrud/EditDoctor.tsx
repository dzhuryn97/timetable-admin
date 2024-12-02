import { FragmentType, graphql, useFragment } from "../../gql";
import {
  EditDoctorFragmentFragment,
  UpdateDoctorMutationVariables,
} from "../../gql/graphql";
import { executeQuery, GQValidationError } from "../../hooks/useGraphQL";
import { uploadFile } from "../ImageUploader";
import { useDispatchSuccessNotification } from "../NotificationShower";
import { DoctorForm, FormValues } from "./Form/DoctorForm";
import { DaySlotTemplateModel } from "./Models";
import { transformDaySlotTemplatesValuesToInput } from "./Transformer";

type EditDoctorProps = {
  doctor: FragmentType<typeof editDoctorFragment>;
};

const editDoctorFragment = graphql(`
  fragment EditDoctorFragment on Doctor {
    id
    name
    description
    photo
    daySlotTemplates {
      id
      dayNumber
      status
      workHours
    }
  }
`);

const updateDoctorMutation = graphql(`
  mutation updateDoctor(
    $id: ID!
    $name: String!
    $description: String!
    $photo: String
    $daySlotTemplates: [DaySlotTemplateInput!]!
  ) {
    updateDoctor(
      input: {
        id: $id
        name: $name
        description: $description
        photo: $photo
        daySlotTemplates: $daySlotTemplates
      }
    ) {
      id
    }
  }
`);

function editDoctorToFormValuesTransformer(
  doctor: EditDoctorFragmentFragment,
): FormValues {
  console.log(doctor);
  return {
    name: doctor.name,
    description: doctor.description,
    photo: doctor.photo,
    daySlotTemplates: doctor.daySlotTemplates.map(
      function (daySlotTemplate): DaySlotTemplateModel {
        return transformDaySlotInputToDaySlotTemplatesValues(daySlotTemplate);
      },
    ),
  };
}

export function transformDaySlotInputToDaySlotTemplatesValues(
  daySlotTemplate: EditDoctorFragmentFragment["daySlotTemplates"][0],
) {
  return {
    id: daySlotTemplate.id,
    status: daySlotTemplate.status,
    dayNumber: daySlotTemplate.dayNumber,
    workHours: daySlotTemplate.workHours,
  };
}

export default function EditDoctor(props: EditDoctorProps) {
  const doctor = useFragment(editDoctorFragment, props.doctor);

  const successNotificationDispatcher = useDispatchSuccessNotification();
  const doctorId = doctor.id;
  const formValues = editDoctorToFormValuesTransformer(doctor);

  async function handleSuccessSubmit(
    doctor: FormValues,
  ): Promise<GQValidationError | void> {
    let vars: UpdateDoctorMutationVariables = {
      id: doctorId,
      name: doctor.name,
      description: doctor.description,
      daySlotTemplates: doctor.daySlotTemplates.map(function (daySlotTemplate) {
        return transformDaySlotTemplatesValuesToInput(daySlotTemplate);
      }),
    };

    if (doctor.photo instanceof File) {
      vars.photo = await uploadFile(doctor.photo);
    }

    const result = await executeQuery(updateDoctorMutation, vars);

    if (result.data.updateDoctor) {
      successNotificationDispatcher("Doctor updated");
      return;
    }

    const error = result.errors.getError("updateDoctor");
    if (error instanceof GQValidationError) {
      return error;
    }

    throw new Error(error.message);
  }

  return (
    <>
      <DoctorForm
        doctor={formValues}
        action={"create"}
        onSuccessSubmit={handleSuccessSubmit}
      />
    </>
  );
}
