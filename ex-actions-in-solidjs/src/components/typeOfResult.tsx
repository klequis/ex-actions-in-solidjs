const log = console.log;
export function TypeOfResult(props: { r: any }) {
  log("TypeOfResult: props.r:", props.r);
  const renderResult = (type: string, value: string) => (
    <div>
      <ul>
        <li>
          <code>sub.result</code> is a <code>{type}</code>
        </li>
        <li>
          <code>props.r</code> is <code>{value}</code>
        </li>
      </ul>
    </div>
  );

  if (props.r instanceof Error) {
    return renderResult("Error", props.r.message);
  }

  if (typeof props.r === "string") {
    return renderResult("string", props.r);
  }

  if (Array.isArray(props.r)) {
    return renderResult("array", JSON.stringify(props.r));
  }

  if (typeof props.r === "object" && props.r !== null) {
    return renderResult("object", JSON.stringify(props.r));
  }

  return renderResult("unknown type", String(props.r));
}