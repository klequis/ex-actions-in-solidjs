export function TypeOfResult(props: { r: any }) {
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

// export function TypeOfResult(props: { r: any }) {
//   if (props.r instanceof Error) {
//     return (
//       <div>
//         <ul>
//           <li>
//             <code>sub.result</code> is <code>instanceof Error</code>
//           </li>
//           <li>
//             <code>props.r.message</code> is <code>{props.r.message}</code>
//           </li>
//         </ul>
//       </div>
//     );
//   }
//   if (typeof props.r === "string") {
//     return (
//       <div>
//         <ul>
//           <li>
//             <code>sub.result</code> is a <code>string</code>
//           </li>
//           <li>
//             <code>props.r</code> is <code>{props.r}</code>
//           </li>
//         </ul>
//       </div>
//     );
//   }
//     if (typeof props.r === "object") {
//     return (
//       <div>
//         <ul>
//           <li>
//             <code>sub.result</code> is an <code>object</code>
//           </li>
//           <li>
//             <code>JSON.stringify(props.r)</code> is <code>{JSON.stringify(props.r)}</code>
//           </li>
//         </ul>
//       </div>
//     );
//   }
// }
