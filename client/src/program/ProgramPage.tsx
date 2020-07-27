import React from "react";

import StudentProgramPage from "./StudentProgramPage";
import TeacherProgramPage from "./TeacherProgramPage";

import { useAuth } from "../context/auth";

type Props = {
  program: string;
  edition: string;
};

function ProgramPage(props: Props) {
  const { isStudent, isTeacher } = useAuth();
  const { program, edition } = props;

  return (
    <React.Fragment>
      {isStudent ? (
        <StudentProgramPage program={program} edition={edition} />
      ) : isTeacher ? (
        <TeacherProgramPage program={program} edition={edition} />
      ) : (
        <StudentProgramPage program={program} edition={edition} />
      )}
    </React.Fragment>
  );
}

export default ProgramPage;
