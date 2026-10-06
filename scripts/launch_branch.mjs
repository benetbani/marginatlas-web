/**
 * THE LAUNCH BRANCH, REBUILT ON MAIN (2026-10-06). LAUNCH-SWITCHES row 12: launch day pushes one commit on `main` that
 * deletes NEXT_PUBLIC_SITE_PRIVATE from .env.production and adds nothing (his ruling 5). `main` moves until then, so the
 * branch is rebuilt, never rebased by hand: git plumbing in a temporary index, the working tree untouched, and no line of
 * the env file printed (key names and counts only).
 *
 * usage, from E:/atlas/website: npm run launch:branch    (then, on his word: git push origin launch-day:main)
 */
import { execFileSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const PRIVATE_KEY = "NEXT_PUBLIC_SITE_PRIVATE=";

/** The env file without its private line; throws unless exactly one line sets the key. */
export function withoutPrivateLine(text) {
  const nl = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = text.split(nl);
  const hits = lines.filter((l) => l.trim().startsWith(PRIVATE_KEY)).length;
  if (hits !== 1) throw new Error(`expected exactly one ${PRIVATE_KEY} line in .env.production, found ${hits}`);
  return lines.filter((l) => !l.trim().startsWith(PRIVATE_KEY)).join(nl);
}

export function rebuildLaunchBranch({ cwd = process.cwd(), base = "main", branch = "launch-day" } = {}) {
  const git = (args, opts = {}) => execFileSync("git", args, { cwd, encoding: "utf8", ...opts }).trim();
  const baseSha = git(["rev-parse", base]);
  const source = execFileSync("git", ["show", `${baseSha}:.env.production`], { cwd }).toString("utf8");
  const blob = git(["hash-object", "-w", "--stdin"], { input: withoutPrivateLine(source) });
  const index = resolve(cwd, git(["rev-parse", "--git-dir"]), "launch-branch.index");
  if (existsSync(index)) rmSync(index);
  const env = { ...process.env, GIT_INDEX_FILE: index };
  git(["read-tree", baseSha], { env });
  git(["update-index", "--cacheinfo", `100644,${blob},.env.production`], { env });
  const tree = git(["write-tree"], { env });
  rmSync(index);
  const message = [
    "launch day: the site opens; the private line comes off, nothing is added",
    "",
    `His ruling 5 keeps the sample marks off; the sample gate passes a public build while the honesty stands in source. Built on ${base} ${baseSha.slice(0, 8)} by npm run launch:branch. LAUNCH-SWITCHES row 12: push this after his review, nothing else.`,
    "",
  ].join("\n");
  const commit = git(["commit-tree", tree, "-p", baseSha], { input: message });
  git(["update-ref", `refs/heads/${branch}`, commit]);
  return { base: baseSha, commit };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const { base, commit } = rebuildLaunchBranch();
  console.log(`launch-day: ${commit.slice(0, 8)}, one commit on main ${base.slice(0, 8)} that deletes the private line and adds nothing`);
  console.log("Push it on launch day, after his review: git push origin launch-day:main");
}
