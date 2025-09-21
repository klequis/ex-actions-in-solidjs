import { ErrorBoundary } from "solid-js";

function Throws() {
  throw new Error("error01 threw");
  return <h1>Never gets here.</h1>;
}

export default function Error01() {
  return (
    <>
      <h1>Error01</h1>
      <ErrorBoundary fallback={<h2>It threw</h2>}>
        <Throws />
      </ErrorBoundary>
    </>
  );
}
