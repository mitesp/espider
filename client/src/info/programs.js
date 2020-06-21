export function canonicalizeProgramName(program) {
  return program === "hssp"
    ? program.toUpperCase()
    : program.charAt(0).toUpperCase() + program.slice(1);
}

export default ["splash", "spark", "hssp", "cascade", "firestorm"];
