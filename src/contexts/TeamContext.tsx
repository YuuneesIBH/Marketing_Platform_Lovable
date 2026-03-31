import { createContext, useContext, useState, ReactNode } from "react";

export interface TeamMember {
  name: string;
  role: string;
  email: string;
  initials: string;
  color: string;
}

interface TeamContextType {
  team: TeamMember[];
  addMember: (member: TeamMember) => void;
  removeMember: (index: number) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

const colors = ["bg-primary", "bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4"];

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [team, setTeam] = useState<TeamMember[]>([]);

  const addMember = (member: TeamMember) => {
    setTeam((prev) => [...prev, { ...member, color: colors[prev.length % colors.length] }]);
  };

  const removeMember = (index: number) => {
    setTeam((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <TeamContext.Provider value={{ team, addMember, removeMember }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used within TeamProvider");
  return ctx;
};
