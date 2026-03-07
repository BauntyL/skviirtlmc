import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

type UserResponse = z.infer<typeof api.users.list.responses[200]>[number];

export function useUsers() {
  return useQuery<UserResponse[]>({
    queryKey: [api.users.list.path],
    queryFn: async () => {
      const res = await fetch(api.users.list.path);
      if (!res.ok) throw new Error("Failed to fetch users");
      return await res.json();
    },
  });
}

export function useUser(username: string) {
  const path = api.users.byUsername.path.replace(":username", username);
  return useQuery<UserResponse>({
    queryKey: [path],
    queryFn: async () => {
      const res = await fetch(path);
      if (!res.ok) throw new Error("Failed to fetch user");
      return await res.json();
    },
    enabled: !!username,
  });
}
