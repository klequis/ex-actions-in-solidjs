import {
  createEffect,
  ErrorBoundary,
  Match,
  Show,
  Suspense,
  Switch,
} from "solid-js";
import {
  action,
  createAsync,
  json,
  query,
  Submission,
  useSubmission,
} from "@solidjs/router";
import type { User } from "../types";
import { DisplayUsers } from "../components/displayUsers";
import { TypeOfResult } from "../components/typeOfResult";
import { TypeOfError } from "../components/typeOfError";
import { getTime } from "../lib/getTime";
import { validateNumber } from "../lib/validateNumber";
import { db } from "../lib/db";
import { consoleOutput } from "../lib/consoleOutput";
// import { isServer } from "solid-js/web";
const log = console.log;

const getUsers = query((id?: number) => {
  const user = db(id);
  return user;
}, "getUser");

const isAdmin = action(async (formData: FormData) => {
  try {
    const id = Number(formData.get("userid"));
    if (!validateNumber(id)) {
      return json(new Error("Missing param 'id'"));
    }
    const user = (await getUsers(Number(id))) as User[];
    log("user", user);
    
    // Yes, throw this
    log('before 10')
    if (id === 10) throw new Error("ERROR: throw user selected.");
    log('after 10')
    if (user.length === 0) return json(new Error(`Unknown ID: ${id}`));
    if (!user[0]?.admin) return json(new Error("User is not admin."));
    return user;
  } catch (e) {
    // log("e", e);
    const msg = e instanceof Error ? e.message : "unknown error";
    throw new Error(msg);
  }
});

export default function Home() {
  const users = createAsync(async () => {
    return (await getUsers()) as User[];
  });
  const sub = useSubmission(isAdmin);

  createEffect(() => {
    if (users() && !sub.pending) {
      console.group(getTime("errInJSON"));
      consoleOutput(sub as Submission<[formData: FormData], User[] | Error>);
      console.groupEnd();
    }
  });

  return (
    <section>
      <ErrorBoundary fallback={<h1>ErrorBoundary fallback</h1>}>
        <h1>errInJson</h1>
        <p>
          In the action's <code>try</code>, expected errors are returned as{" "}
          <code>json(new Error("..."))</code>.
        </p>
        <p>Unexpected errors are thrown from the catch.</p>
        <Suspense fallback={<h1>Suspense fallback...</h1>}>
          <Show when={users()}>
            <DisplayUsers users={users() as User[]} action={isAdmin} />
          </Show>
          <Show when={sub.pending}>
            <p>Pending</p>
          </Show>
          <Show when={!sub.pending}>
            <Switch>
              <Match when={sub.result}>
                <h2>Result</h2>
                <TypeOfResult r={sub.result} />
              </Match>
              <Match when={sub.error}>
                <h2>Error</h2>
                <TypeOfError e={sub.error} />
              </Match>
            </Switch>
          </Show>
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}

function DisplayUser(props: { user: User }) {
  return (
    <form action={isAdmin} method={"post"}>
      <li class="user-li">
        <div>
          <input
            class="id-input"
            name="userid"
            id="userid"
            value={props.user.id}
          />
          <input
            class="name-input"
            name="name"
            id="name"
            value={props.user.name}
            disabled
          />
          <input
            class="isAdmin-input"
            name="isadmin"
            id="isadmin"
            value={props.user.admin ? "true" : "false"}
            disabled
          />
          <button type="submit">isAdmin?</button>
        </div>
      </li>
    </form>
  );
}
