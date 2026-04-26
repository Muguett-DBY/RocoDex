import type { PvpTeam } from "@/types/pvp-team";

export function pvpTeamSlug(team: PvpTeam) {
  return `${team.id}-${slugify(team.name)}`;
}

export function getPvpTeamBySlug(teams: PvpTeam[], slug: string) {
  return teams.find((team) => pvpTeamSlug(team) === slug || team.id === slug);
}

export function slugify(value: string) {
  return encodeURIComponent(value.trim().replace(/\s+/g, "-"));
}
