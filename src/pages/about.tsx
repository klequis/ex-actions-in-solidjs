// file: src/routes/about.tsx
import { Show } from "solid-js";
import { action, redirect, useAction, useSubmission } from "@solidjs/router";

const isAdmin = action(async (formData: FormData) => {
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  const username = formData.get("username");

  if (username === "admin") throw redirect("/admin");
  return new Error("Invalid username");
}, "login");

export default function About() {
  const submit = useAction(isAdmin);
  const submission = useSubmission(isAdmin);
  const submitListener = (e: Event & { currentTarget: HTMLFormElement }) => {
    submission.clear?.();
    submit(new FormData(e.currentTarget));
  };

  return (
    <main>
      <h1>About</h1>
      <form action={isAdmin} method="post" onSubmit={submitListener}>
        <label for="username">Username:</label>
        <input type="text" name="username" />
        <input type="submit" value="submit" />
      </form>
      <Show when={submission.result}>
        {(error) => <p>{error().message}</p>}
      </Show>
    </main>
  );
}
