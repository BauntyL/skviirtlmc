import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

type ClanListResponse = z.infer<typeof api.clans.list.responses[200]>;

export function useClans() {
  return useQuery<ClanListResponse>({
    queryKey: [api.clans.list.path],
    queryFn: async () => {
      const res = await fetch(api.clans.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch clans");
      return api.clans.list.responses[200].parse(await res.json());
    },
  });
}
