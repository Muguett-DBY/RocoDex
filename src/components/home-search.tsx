"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HomeSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <form
      className="flex w-full flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        router.push(`/creatures${params.toString() ? `?${params.toString()}` : ""}`);
      }}
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-12 pl-10 text-base"
          placeholder="搜索精灵名称、编号、地点或获得方式"
        />
      </div>
      <Button className="h-12 px-6" type="submit">
        搜索图鉴
      </Button>
    </form>
  );
}
