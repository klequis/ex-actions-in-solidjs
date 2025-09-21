export function TypeOfError(props: { e: any }) {
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
  if (props.e instanceof Error) {
    return renderResult("Error", props.e.message);
  }
  if (typeof props.e === "string") {
    return renderResult("string", props.e);
  }
  if (Array.isArray(props.e)) {
    return renderResult("array", JSON.stringify(props.e));
  }
  if (typeof props.e === "object" && props.e !== null) {
    return renderResult("object", JSON.stringify(props.e));
  }
  return renderResult("unknown type", String(props.e));
}
