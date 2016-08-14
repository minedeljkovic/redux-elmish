export default function assertNever(impossible) {
  throw new Error(`Unexpected value ${impossible}`);
}
