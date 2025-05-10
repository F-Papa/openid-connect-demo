export function logWithEmphasis(title: string, content: unknown) {
  console.log(`----------------## ${title.toUpperCase()} ##----------------`);
  console.log(JSON.stringify(content, null, 3));
  console.log(`--------------## END ${title.toUpperCase()} ##--------------`);
}

export function isString(arg: unknown): arg is string {
  return typeof arg === "string";
}
