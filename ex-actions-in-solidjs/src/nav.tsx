import { A } from "@solidjs/router";
export default function Nav() {
  return (
    <nav>
      <A href="/errInJson">Error in JSON</A>
      <A href="/throwAllErrors">Throw All Errors</A>
    </nav>
  );
}
