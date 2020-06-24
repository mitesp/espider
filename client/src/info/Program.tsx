import React from "react";
import "react-bulma-components/dist/react-bulma-components.min.css";

export function canonicalizeProgramName(program: string) {
  return program === "hssp"
    ? program.toUpperCase()
    : program.charAt(0).toUpperCase() + program.slice(1);
}

export const programList = ["splash", "spark", "hssp", "cascade", "firestorm"];

//TODO: we could write this stuff in md format or something and generate it
export default function (props: { program: string }) {
  const program = <b>{canonicalizeProgramName(props.program)}</b>;
  return (
    <div className="container pt-3" style={{}}>
      <h1 className="is-size-1">{program}</h1>
      <div className="columns">
        <div className="column">
          <img
            className="level-item"
            src="https://qph.fs.quoracdn.net/main-qimg-338d75dbb172519677a52c5d7db1192d"
            alt="school of fish"
          />{" "}
        </div>
        <div className="column">
          Lorem ipsum dolor sit amet {program}, consectetur adipiscing elit. Donec vel nunc ut enim
          sagittis interdum. Vestibulum {program} dapibus urna eu neque luctus maximus. Sed eu
          cursus nunc, id imperdiet lorem. Praesent arcu {program} felis, varius sed nibh eu,
          vehicula molestie nunc. Morbi ac arcu id ante porttitor tempor. Suspendisse mollis tellus
          ipsum. Morbi {program} pretium mi sit amet eros {program} consequat, ac ornare tortor
          lobortis. Morbi scelerisque sit amet dolor ac ullamcorper. Curabitur eget {program}{" "}
          ullamcorper ligula. Fusce {program} bibendum bibendum massa. Nunc non luctus est.
          Phasellus ante massa, condimentum vitae suscipit eget, cursus at {program} nunc. Cras
          porta, {program} lorem et condimentum dapibus, velit ex laoreet purus, sit amet blandit mi{" "}
          {program} urna eu arcu. Aliquam porta felis et felis porta, et fermentum purus laoreet.
          Pellentesque faucibus odio sit amet {program} lectus finibus luctus. Pellentesque nec
          felis blandit, vulputate nisi ac, porttitor {program} justo. Cras at urna sit amet metus
          efficitur varius ac {program} sit amet libero. Mauris dictum lacus {program} quis velit
          finibus, eget tincidunt erat feugiat.
        </div>
      </div>
    </div>
  );
}
