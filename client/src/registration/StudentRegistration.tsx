import React, { useState } from "react";
// import axiosInstance from "../axiosAPI";
//TODO use sass for customization possibilities in the future
import "./bulma-steps.min.css";

import DummyForm from "./DummyForm";
import EmergencyInfoForm from "./EmergencyInfoForm";
import UpdateProfileForm from "./UpdateProfileForm";

import {
  liabilityWaiverEndpoint,
  medicalLiabilityEndpoint,
  studentAvailabilityEndpoint,
} from "../apiEndpoints";
import { generalPage } from "../layout/Page";

type Props = {
  program: string;
  edition: string;
  checks: {
    availabilityCheck: boolean;
    emergencyInfoCheck: boolean;
    liabilityCheck: boolean;
    medliabCheck: boolean;
    updateProfileCheck: boolean;
  };
};

// TODO: final confirmation state or page
function StudentRegistration(props: Props) {
  // TODO: stateful "active" step selection based on progress on other steps
  // TODO: figure out general flow (can people go backwards?, etc)
  const [selectedStep, setSelectedStep] = useState(0);

  const steps = [
    {
      name: "updateprofile",
      text: "Update profile",
      component: <UpdateProfileForm {...props} />,
    },
    {
      name: "emergencyinfo",
      text: "Emergency info",
      component: <EmergencyInfoForm {...props} />,
    },
    {
      name: "medicalliability",
      text: "Medical liability",
      component: (
        <DummyForm url={medicalLiabilityEndpoint} formName="Medical Liabilility Form" {...props} />
      ),
    },
    {
      name: "waiver",
      text: "Waiver",
      component: (
        <DummyForm url={liabilityWaiverEndpoint} formName="Liability Waiver Form" {...props} />
      ),
    },
    {
      name: "availability",
      text: "Program availability",
      component: (
        <DummyForm url={studentAvailabilityEndpoint} formName="Program Availability" {...props} />
      ),
    },
  ];

  function generateStep(stepName: string, stepText: string, index: number) {
    return (
      <li className={"steps-segment" + (index === selectedStep ? " is-active" : "")} key={index}>
        <a href={`#${stepName}`} onClick={() => setSelectedStep(index)}>
          <span className="steps-marker"></span>
          <div className="steps-content">
            <p className="is-size-4">{stepText}</p>
          </div>
        </a>
      </li>
    );
  }
  return generalPage(`${props.program} ${props.edition} Registration | MIT ESP`)(
    <React.Fragment>
      <ul className="steps has-content-centered">
        {steps.map((step, index) => generateStep(step.name, step.text, index))}
      </ul>
      {steps[selectedStep].component}
    </React.Fragment>
  );
}

export default StudentRegistration;
