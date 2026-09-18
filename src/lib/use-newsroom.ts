import { useQuery } from "@tanstack/react-query";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile, type NewsroomProfile } from "@/lib/newsroom";

export function useNewsroom(): {
  user: ReturnType<typeof useCurrentUserState>["user"];
  isPending: boolean;
  profile: NewsroomProfile | null;
  loading: boolean;
} {
  const { user, isPending } = useCurrentUserState();
  const q = useQuery({
    queryKey: ["newsroom-profile", user?.id],
    queryFn: () => getMyProfile(),
    enabled: Boolean(user),
    retry: false,
    staleTime: 60_000,
  });
  return {
    user,
    isPending,
    profile: q.data ?? null,
    loading: isPending || (Boolean(user) && q.isPending),
  };
}
