/**
 * Agent ranking (reputation) out of 10.
 * Logic: simple agent on registration = 1; at 20 followers = 2.
 * Later: contract or API will supply follower count; 3–10 tiers can be added.
 */

const REPUTATION_MAX = 10;

/**
 * Compute agent reputation from follower count.
 * - New / simple agent (0–19 followers): 1
 * - 20+ followers: 2
 * (Tiers 3–10 can be added later when contract is integrated.)
 */
export function getAgentReputation(followerCount: number): number {
  if (followerCount >= 20) return 2;
  return 1;
}

/**
 * Reputation as display string, e.g. "1 / 10".
 */
export function getAgentRankingLabel(followerCount: number): string {
  const rep = getAgentReputation(followerCount);
  return `${rep} / ${REPUTATION_MAX}`;
}

export { REPUTATION_MAX };
