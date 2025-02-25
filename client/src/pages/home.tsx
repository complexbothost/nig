import { useEffect } from "react";
import { StarField } from "@/components/stars/StarField";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Home() {
  const { data: viewData } = useQuery({
    queryKey: ["/api/views"],
  });

  const incrementViewsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/views/increment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/views"] });
    },
  });

  useEffect(() => {
    incrementViewsMutation.mutate();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      <StarField />

      <div className="z-10 text-center space-y-6">
        <div className="w-32 h-32 mx-auto">
          <Avatar className="w-full h-full border-4 border-purple-500/30 shadow-lg shadow-purple-500/50" style={{
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)'
          }}>
            <AvatarImage src="https://i.imgur.com/QkIa5tT.jpeg" alt="Profile" />
            <AvatarFallback>K</AvatarFallback>
          </Avatar>
        </div>

        <h1 className="text-5xl font-bold text-white animate-glow" style={{ textShadow: '0 0 15px rgba(168, 85, 247, 0.8), 0 0 30px rgba(168, 85, 247, 0.6)' }}>
          krane
        </h1>

        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <span className="text-sm">Views:</span>
          <span className="text-lg font-semibold">
            {viewData?.views || 0}
          </span>
        </div>
      </div>
    </div>
  );
}