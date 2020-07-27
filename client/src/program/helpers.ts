function isStudentRegistered(regChecks: object) {
  //@ts-ignore
  return Object.keys(regChecks).every(k => regChecks[k]);
}

export { isStudentRegistered };
