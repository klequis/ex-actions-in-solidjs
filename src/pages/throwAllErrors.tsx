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
import { wait } from "../wait";
// import { isServer } from "solid-js/web";
const log = console.log;

type User = {
  id?: number;
  name: string;
  admin: boolean;
};

const users: User[] = [
  { id: 0, name: "user1", admin: false },
  { id: 1, name: "user2", admin: true },
];

const getUsers = query((id?: number): Promise<User | User[] | null> => {
  return new Promise((resolve, reject) => {
    // const user = id ? users[id] : users;
    const user = id ? users[id] || null : users;
    // log('getUser-------')
    // log('id', id)
    // log('user', user)
    // log("typeof user", typeof user)
    // log('--------------')
    console.log("user**", user ? "true" : "false");
    return setTimeout(() => {
      if (user) {
        resolve(user);
      } else {
        reject(new Error("User not found"));
      }
    }, 3000);
  });
}, "getUser");

const isAdmin = action(async (formData: FormData) => {
  try {
    await wait();
    const id = formData.get("userid");
    log("id", id === "undefined");
    if (id === "undefined") {
      throw new Error("Missing param 'id'");
    }
    // If the user is not found this will throw 'User not found
    const user = (await getUsers(Number(id))) as User;
    if (!user?.admin) throw new Error("User is not admin");
    // return json({ success: true, data: user }, { revalidate: "none" });
    return user;
  } catch (e) {
    log("e", e);
    const msg = e instanceof Error ? e.message : "unknown error";
    throw new Error(msg);
    // return json({ success: false, data: [], msg }, { revalidate: "none" });
  }
});
function stringErrorUser(errOrResult: string | Error | User) {
  if (typeof errOrResult === "string") {
    console.log("string: ", errOrResult);
    return errOrResult;
  }
  if (errOrResult instanceof Error) {
    console.log("error.message", errOrResult.message);
    return errOrResult.message;
  }
  console.log("userid is:", errOrResult.id);
  return (
    <>
      id: {errOrResult.id}, name: {errOrResult.name}
    </>
  );
}

export default function Home() {
  const users = createAsync(async () => {
    const a: User[] = (await getUsers()) as User[];
    return a;
  });
  const sub = useSubmission(isAdmin);

  createEffect(() => {
    if (users()) {
      log("log sub", {
        error: sub.error,
        result: sub.result,
        input: sub.input,
        pending: sub.pending,
        url: sub.url,
        users: users(),
      });
    }
  });

  return (
    <section>
      <ErrorBoundary fallback={<h1>ERROR</h1>}>
        <h1>Throw All Errors</h1>
        <Suspense fallback={<h1>Loading...</h1>}>
          <Show when={users()}>
            <For each={users()}>{(u: User) => <DisplayUser user={u} />}</For>
            <DisplayUser user={{ name: "dummy", admin: false }} />
            <DisplayUser user={{ name: "unknownId", admin: false, id: 9 }} />
          </Show>
          <Show when={sub.pending}>
            <p>Pending</p>
          </Show>
          <Show when={sub.result}>{(error) => <p>{error().message}</p>}</Show>
          <Show when={!sub.pending}>
            <Switch>
              <Match when={sub.result}>
                <h2>Result</h2>
                <p>typeof sub.result: {typeof sub.result}</p>
                <ul>
                  <li>
                    <code>sub.result.name</code> returns: {sub.result?.name}
                  </li>
                  <li>
                    <code>stringErrorUser()</code> returns:{" "}
                    {stringErrorUser(sub.result)}
                  </li>
                </ul>
              </Match>
              <Match when={sub.error}>
                <ul>
                  <li>
                    <code>sub.error instanceof Error ? sub.error.message : sub.error</code> returns: {sub.error instanceof Error ? sub.error.message : sub.error}
                  </li>
                  <li>
                    <code>stringErrorUser()</code> returns:{" "}{stringErrorUser(sub.error)}
                  </li>
                </ul>
              </Match>
            </Switch>
          </Show>
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}

function DisplayUser(props: { user: User }) {
  log();
  // const id = props.user.id === undefined ? "" : props.user.id
  return (
    <form action={isAdmin} method={"post"}>
      <li>
        <input name="userid" id="userid" value={props.user.id} />
        {/* {`${props.user.name}, ${
          props.user.admin ? "is admin" : "isn't admin"
        }`}{" "} */}
        <span>
          {" "}
          {props.user.name}, {props.user.admin ? "is admin" : "not admin"}
        </span>
        <button type="submit">isAdmin?</button>
      </li>
    </form>
  );
}
