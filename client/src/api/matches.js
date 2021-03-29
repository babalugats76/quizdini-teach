import { get, post, put } from "@/utils/fetch";
const ENDPOINT = "/api/matches";

const getMatch = (matchId) => get({ url: `${ENDPOINT}/${matchId}` });
const getMatches = () => get({ url: `${ENDPOINT}` });
const postMatch = (match) => post({ url: `${ENDPOINT}`, data: match });
const updateMatch = (match) => {
  const { matchId = null } = match;
  return put({ url: `${ENDPOINT}`, data: match, id: matchId });
};
const getMatchStats = (matchId) => get({ url: `${ENDPOINT}/${matchId}/stats` });

export { getMatch, getMatches, postMatch, updateMatch, getMatchStats };
