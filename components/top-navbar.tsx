import Link from "next/link";
import { ModeToggle } from "./theme-button";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import TopNavBarUserButton from "./top-navbar-user-button";

const supabase = createServerComponentClient({ cookies });

export default async function TopNavBar() {
  const user = await supabase.auth.getUser();
  const { data } = await supabase
    .from("user")
    .select("*")
    .eq("userId", user.data.user?.id)
    .single();
  return (
    <nav className="flex flex-row items-center justify-between p-4 text-white bg-primary">
      <Link href={"/"} className="text-xl font-extrabold">
        Expenlist.
      </Link>
      <div className="flex flex-row items-center justify-center gap-2">
        <ModeToggle />
        {data && <TopNavBarUserButton user={data} />}
      </div>
    </nav>
  );
}