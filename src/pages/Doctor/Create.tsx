import { useState } from "react";
import { Navigate } from "react-router-dom";
import CreateDoctor from "../../components/DoctorsCrud/CreateDoctor";

export default function Create() {
  const [createdId, setCreatedId] = useState("");

  if (createdId) {
    return <Navigate to={"/doctor/" + createdId} />;
  }

  return (
    <>
      <CreateDoctor onDoctorCreated={(doctorId) => setCreatedId(doctorId)} />
    </>
  );
}
