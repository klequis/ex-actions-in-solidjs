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
  json,
  query,
  useSubmission,
} from "@solidjs/router";
import { TypeOfResult } from "../typeOfResult";
import { TypeOfError } from "../typeOfError";
import { getTime } from "../getTime";
// import { isServer } from "solid-js/web";
const log = console.log;

type User = {
  id?: number;
  name: string;
  admin: boolean;
};

const users: User[] = [
  { id: 0, name: "validUser", admin: true },
  { id: 1, name: "notAdmin", admin: false },
];

function db(id?: number): Promise<User | User[] | Error> {
  return new Promise((resolve, reject) => {
    const user = id ? users[id] : users;
    return setTimeout(() => {
      if (user) {
        resolve(user);
      } else {
        reject(new Error("User not found"));
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
    const id = formData.get("userid");
    if (!id) {
      return json(new Error("Missing param 'id'"));
    }
    const user = (await getUsers(Number(id))) as User;
    if (!user) return json(new Error("User not found."));
    if (!user?.admin) return json(new Error("User is not admin."));
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

  const addDummyUsers = () => {
    const a = [
      { name: "noID", admin: false },
      { name: "unknownID", admin: true, id: 9 },
    ];
    return [...(users() ?? []), ...a];
  };

  createEffect(() => {
    if (users() && !sub.pending) {
      console.group(getTime("throwAllErrors"))
      tblResult();
      tblError();
      console.groupEnd();
    }
  });

  return (
    <section>
      <ErrorBoundary fallback={<h1>ERROR</h1>}>
        <h1>Error in Json, Throw Unexpected</h1>
        <p>
          In the action's <code>try</code>, expected errors are returned as{" "}
          <code>json(new Error("..."))</code>.
        </p>
        <p>Unexpected errors are thrown from the catch.</p>
        <Suspense fallback={<h1>Loading...</h1>}>
          <Show when={users()}>
            <For each={addDummyUsers()}>
              {(u: User) => <DisplayUser user={u} />}
            </For>
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
