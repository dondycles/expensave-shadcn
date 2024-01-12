"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePhpPeso } from "@/lib/phpformatter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getHistory } from "@/actions/history/get";
import { Skeleton } from "@/components/ui/skeleton";
export default function History({
  searchParams,
}: {
  searchParams: { range: string; last: string };
}) {
  const options = {
    timeZone: "Asia/Manila",
    hour12: false, // Use 24-hour format
  };

  const { data, isLoading } = useQuery({
    queryKey: ["history", searchParams.range],
    queryFn: async () =>
      getHistory({ range: searchParams.range, last: searchParams.last }),
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col w-full h-full max-h-full gap-2 overflow-auto">
      {isLoading ? (
        <div className="flex flex-col h-full gap-2">
          <Skeleton className="flex flex-row w-full h-12 gap-1 p-1">
            <Skeleton className="flex-1 h-full bg-white/5" />
            <Skeleton className="h-full aspect-square bg-black/50" />
            <Skeleton className="h-full aspect-square bg-destructive/50" />
          </Skeleton>
          <Skeleton className="flex flex-row w-full h-12 gap-1 p-1">
            <Skeleton className="flex-1 h-full bg-white/5" />
            <Skeleton className="h-full aspect-square bg-black/50" />
            <Skeleton className="h-full aspect-square bg-destructive/50" />
          </Skeleton>
          <Skeleton className="flex flex-row w-full h-12 gap-1 p-1">
            <Skeleton className="flex-1 h-full bg-white/5" />
            <Skeleton className="h-full aspect-square bg-black/50" />
            <Skeleton className="h-full aspect-square bg-destructive/50" />
          </Skeleton>
        </div>
      ) : (
        <>
          <Table className="text-xs sm:text-sm">
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Cost/Amount</TableHead>
                <TableHead>Deducted To</TableHead>
                <TableHead>Total Savings</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data &&
                data?.data.map((history) => {
                  return (
                    <TableRow id={history.id}>
                      <TableCell
                        className={`flex items-center justify-center `}
                      >
                        {(history.is_deleted && <FaTrash />) ||
                          (history.is_edit && <FaPencilAlt />) || <FaPlus />}
                      </TableCell>
                      <TableCell
                        className={`font-bold ${
                          history.is_expense
                            ? "text-destructive"
                            : "text-primary"
                        }`}
                      >
                        {history.name}
                      </TableCell>
                      <TableCell>{usePhpPeso(history.amount)}</TableCell>
                      <TableCell>
                        {/* {(history.is_deleted && "Delete") ||
                    (history.is_edit && "Edited") ||
                    "Added"} */}
                        {history.is_expense &&
                          history.savings &&
                          history.savings.name +
                            "-" +
                            usePhpPeso(history.savings.amount)}
                      </TableCell>
                      <TableCell>
                        {usePhpPeso(history.savings_overall_total)}
                      </TableCell>
                      <TableCell>
                        {new Date(String(history.created_at)).toLocaleString(
                          "en-US",
                          options
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <div className="flex flex-row items-center justify-between gap-2 mt-auto mb-0">
            {Number(searchParams.range) > 20 ? (
              <div className="flex flex-row gap-2">
                <Button asChild>
                  <Link
                    href={`/history?range=${
                      Number(searchParams.range) === 10 ||
                      Number(searchParams.range) === 0 ||
                      !searchParams.range
                        ? "10"
                        : String(Number(searchParams.range) - 10)
                    }&last=${searchParams.last === "true" ? "true" : "false"}`}
                  >
                    -10
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/history?range=10`}>Back to first</Link>
                </Button>
              </div>
            ) : (
              <>
                {Number(searchParams.range) > 10 && (
                  <Button asChild>
                    <Link
                      href={`/history?range=${
                        Number(searchParams.range) === 10 ||
                        Number(searchParams.range) === 0 ||
                        !searchParams.range
                          ? "10"
                          : String(Number(searchParams.range) - 10)
                      }&last=${
                        searchParams.last === "true" ? "true" : "false"
                      }`}
                    >
                      -10
                    </Link>
                  </Button>
                )}
              </>
            )}

            <p>Last 10 History</p>
            <div className="flex flex-row gap-2">
              {searchParams.last === "false" && (
                <Button asChild>
                  <Link
                    href={`
              /history?range=10&last=true
            `}
                  >
                    From the last
                  </Link>
                </Button>
              )}
              <Button asChild>
                <Link
                  href={`
              /history?range=${
                searchParams.range
                  ? String(Number(searchParams.range) + 10)
                  : "20"
              }&last=${searchParams.last === "true" ? "true" : "false"}
            `}
                >
                  +10
                </Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
