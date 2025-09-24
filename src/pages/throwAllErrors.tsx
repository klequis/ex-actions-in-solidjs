import {
  createEffect,
  ErrorBoundary,
  For,
  Match,
  Show,
  Suspense,
  Switch,
} from "solid-js";
import { action, createAsync, query, useSubmission } from "@solidjs/router";
import { TypeOfResult } from "../typeOfResult";
import { TypeOfError } from "../typeOfError";
import { getTime } from "../getTime";
import { validateNumber } from "../utils/validateNumber";

const log = console.log;

type User = {
  id?: number;
  name: string;
  admin: boolean;
};

const users: User[] = [
  { id: 0, name: "validUser", admin: true },
  { id: 1, name: "notAdmin", admin: false },
  { name: "noID", admin: false },
];

function db(id?: number): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (id === undefined) {
        resolve(users);
      } else {
        const user = users.find((u) => u.id === id);
        resolve(user ? [user] : []); // return as array
      }
    }, 1000);
  });
}

const getUsers = query((id?: number) => {
  const user = db(id);
  return user;
}, "getUser");

const isAdmin = action(async (formData: FormData) => {
  try {
    const id = Number(formData.get("userid"));
    // missing id
    if (!validateNumber(id)) {
      throw new Error("Missing param 'id'");
    }
    const user = (await getUsers(Number(id))) as User[];
    log("user", user);
    if (user.length === 0) throw new Error(`Unknown ID: ${id}`);
    if (id === 10) throw new Error("ERROR: throw user selected.");
    if (!user[0]?.admin) throw new Error("User is not admin.");
    return user;
  } catch (e) {
    log("e", e);
    const msg = e instanceof Error ? e.message : "unknown error";
    throw new Error(msg);
  }
});

export default function Home() {
  const users = createAsync(async () => {
    return (await getUsers()) as User[];
  });
  const sub = useSubmission(isAdmin);

  const tblResult = () => {
    const inputs = [
      ["result", sub.result],
      ["typeof", typeof sub.result],
      ["instanceof Error", sub.error instanceof Error ? "true" : "false"],
    ];
    console.group("sub.result");
    console.table(inputs);
    console.groupEnd();
  };

  const tblError = () => {
    const inputs = [
      ["error", sub.error],
      ["typeof", typeof sub.error],
      ["instanceof Error", sub.error instanceof Error ? "true" : "false"],
    ];

    console.group("sub.error");
    console.table(inputs);
    console.groupEnd();
  };

  createEffect(() => {
    if (users() && !sub.pending) {
      console.group(getTime("throwAllErrors"));
      tblResult();
      tblError();
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
            <For each={users()}>{(u: User) => <DisplayUser user={u} />}</For>
            <DisplayUser user={{ id: 9, name: "unknownID", admin: true }} />
            <DisplayUser user={{ id: 10, name: "throwError", admin: true }} />
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
