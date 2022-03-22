export function throwErrorAsString(e: any) {
  if (e.stderr != undefined) {
    throw e.stderr;
  }
  throw e.toString();
}