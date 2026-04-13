import { createContext, useContext, ReactNode } from "react";
import { usePersistedState } from "@/lib/api";
import type { TeamMember } from "@/lib/app-types";

interface TeamContextType {
  team: TeamMember[];
  loading: boolean;
  addMember: (member: Omit<TeamMember, "id" | "color">) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

const colors = ["bg-primary", "bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4"];

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const { value: team, setValue: setTeam, loading } = usePersistedState<TeamMember[]>("team", []);

  const addMember = async (member: Omit<TeamMember, "id" | "color">) => {
    await setTeam((prev) => [
      ...prev,
      {
        ...member,
        id: `member-${Date.now()}`,
        color: colors[prev.length % colors.length],
      },
    ]);
  };

  const removeMember = async (id: string) => {
    await setTeam((prev) => prev.filter((member) => member.id !== id));
  };

  return (
    <TeamContext.Provider value={{ team, loading, addMember, removeMember }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used within TeamProvider");
  return ctx;
};
