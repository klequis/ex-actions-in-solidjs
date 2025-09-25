import {
  createEffect,
  ErrorBoundary,
  For,
  Match,
  Show,
  Suspense,
  Switch,
} from "solid-js";
import {
  action,
  createAsync,
  query,
  Submission,
  useSubmission,
} from "@solidjs/router";
import { db } from "../lib/db";
import { validateNumber } from "../lib/validateNumber";
import { User } from "../types";
import { consoleOutput } from "../lib/consoleOutput";
import { TypeOfResult } from "../components/typeOfResult";
import { TypeOfError } from "../components/typeOfError";
import { DisplayUsers } from "../components/displayUsers";
import { getTime } from "../lib/getTime";

const log = console.log;

const getUsers = query((id?: number) => {
  const user = db(id);
  return user;
}, "getUser");

const isAdmin = action(async (formData: FormData) => {
  try {
    const id = Number(formData.get("userid"));
    if (!validateNumber(id)) {
      throw new Error("Missing param 'id'");
    }
    const user = (await getUsers(Number(id))) as User[];
    // Yes, throw this
    if (id === 10) throw new Error("ERROR: throw user selected.");
    if (user.length === 0) throw new Error(`Unknown ID: ${id}`);
    if (!user[0]?.admin) throw new Error("User is not admin.");
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
        <h1>throwAllErrors</h1>
        <p>All errors in the action are thrown.</p>
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
