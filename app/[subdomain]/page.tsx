import { headers } from "next/headers";

export default function Component() {
  const headersList = headers();
  const host = headersList.get("host");
  const tenant = host?.split(".")[0];

  return <span>Welcome to {tenant}</span>;
}
