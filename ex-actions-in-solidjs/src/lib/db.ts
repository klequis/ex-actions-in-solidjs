import type { User } from "../types"

// Simulated database

const users: User[] = [
  { id: 0, name: "validUser", admin: true },
  { id: 1, name: "notAdmin", admin: false },
  { name: "noID", admin: false },
];

export function db(id?: number): Promise<User | User[] | Error> {
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
