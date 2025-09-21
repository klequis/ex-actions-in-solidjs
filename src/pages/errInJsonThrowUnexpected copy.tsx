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
    if (id === "undefined") {
      return json(new Error("Missing param 'id'"))
    }
    const user = (await getUsers(Number(id))) as User;
    if (!user?.admin) throw json(new Error("User is not admin"));
    return user;
  } catch (e) {
    log("e", e);
    const msg = e instanceof Error ? e.message : "unknown error";
    throw new Error(msg);
  }
});

function stringErrorUser(caller: string, errOrResult: string | Error | User) {
  
  if (typeof errOrResult === 'string') {
    console.log('string: ', errOrResult)
    return <h3>caller: {caller}, {errOrResult}</h3>
  }
  if (errOrResult instanceof Error ) {
    console.log('error.message', errOrResult.message)
    return <h3>caller: {caller}, {errOrResult.message}</h3>
  }
  console.log('userid is:', errOrResult.id)
  return <h3>caller: {caller}, User</h3>

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
    <section class="bg-gray-100 text-gray-700 p-8">
      <ErrorBoundary fallback={<h1>ERROR</h1>}>
        <h1>errInJsonThrowUnexpected</h1>
        <Suspense fallback={<h1>Loading...</h1>}>
          <Show when={users()}>
            <For each={users()}>{(u: User) => <DisplayUser user={u} />}</For>
            <DisplayUser user={{ name: "dummy", admin: false }} />
            <DisplayUser user={{ name: "unknownId", admin: false, id: 9 }} />
          </Show>
          <Show when={sub.pending}>
            <p>Pending</p>
          </Show>
          {/* <Show when={sub.result}>
            {(error) => <p>{error}</p>}
          </Show> */}
          <Show when={!sub.pending}>
            <Switch>
              <Match when={sub.result}>
                {/* <p>result: {sub.result ? sub.result : ""}</p> */}
                <h2>Result</h2>
                <p>{stringErrorUser('result', sub.result)}</p>
                {/* {(error) => <p>sub.result: {error().message}</p>} */}
              </Match>
              <Match when={sub.error}>
                <h2>Error</h2>
                <p>{stringErrorUser('error', sub.error)}</p>
              </Match>
              {/* <Match when={sub.error}> */}
              {/* <p>Error: {sub.error}</p> */}
              {/* {(error) => <p>sub.error: {error().message}</p>} */}
              {/* </Match> */}
            </Switch>
          </Show>

          {/* <Show when={sub?.result}>
            <p>result.success: {sub.result?.success ? "true" : "false"}</p>
            <p>result.data: {sub.result?.data}</p>
            <Switch>
              <Match when={sub.error}>
                <p>Error: {sub.error}</p>
              </Match>
              <Match when={sub.result}>
                <p>Match success</p>
              </Match>

              <Match when={!sub.result?.success}>
                <p>Match fail</p>
              </Match>
            </Switch>
          </Show> */}
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
