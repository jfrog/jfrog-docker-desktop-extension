export function throwErrorAsString(e: any) {
  let stringErr: string;
  if (e.stderr != undefined) {
    stringErr = e.stderr;
  } else {
    stringErr = e.toString();
  }
  console.log(stringErr);
  throw stringErr;
}