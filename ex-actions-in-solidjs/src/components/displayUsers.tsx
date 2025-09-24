import type { User } from "../types";
import { For, JSX, Match, Show, Suspense, Switch } from "solid-js";

type Action = (J: FormData) => Promise<User[] | Error | Response | JSX.Element>;

function UserForm(props: { user: User; action: Action }) {
  return (
    <form action={props.action} method={"post"}>
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

export function DisplayUsers(props: { users: User[]; action: Action }) {
  return (
    <>
      <For each={props.users}>
        {(u: User) => <UserForm user={u} action={props.action} />}
      </For>
      <UserForm
        user={{ id: 9, name: "unknownID", admin: true }}
        action={props.action}
      />
      <UserForm
        user={{ id: 10, name: "throwError", admin: true }}
        action={props.action}
      />
    </>
  );
}
