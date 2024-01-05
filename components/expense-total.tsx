import { usePhpPeso } from "@/lib/phpformatter";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
var _ = require("lodash");
const supabase = createServerComponentClient({ cookies });

export default async function ExpenseTotal() {
  const date = new Date().toISOString();
  const { data, error } = await supabase
    .from("expenses")
    .select("cost")
    .eq("date", date);

  const total = _.sum(
    data?.map((expense: { cost: any }) => Number(expense.cost))
  );

  return (
    <div className="flex flex-row items-center gap-2">
      <p>{usePhpPeso(total)}</p>
    </div>
  );
}