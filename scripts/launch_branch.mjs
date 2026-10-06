/**
 * THE LAUNCH BRANCH, REBUILT ON MAIN (2026-10-06). LAUNCH-SWITCHES row 12: launch day pushes one commit on `main` that
 * deletes NEXT_PUBLIC_SITE_PRIVATE from .env.production and adds nothing (his ruling 5). `main` moves until then, so the
 * branch is rebuilt, never rebased by hand: git plumbing in a temporary index, the working tree untouched, and no line of
 * the env file printed (key names and counts only).
 *
 * WHAT IT PROVES BEFORE THE BRANCH MOVES (the task review of 2026-10-06): the env file's bytes pass through as they are
 * (latin1 in, latin1 out, so a stray non-UTF-8 byte survives) and every other line keeps its own ending (a last line with
 * no newline, a file of mixed endings); the rebuilt tree must be exactly one deleted line of .env.production away from the
 * base, read back with `git diff-tree --numstat`, or the branch is not moved; the temporary index is removed on every
 * path; and the branch is never rebuilt while a worktree has it checked out. Git runs with inherited repository variables
 * cleared (a hook's GIT_INDEX_FILE would otherwise send the temporary index's writes to the real one) and its stderr
 * captured, so the command prints its two lines, or one line naming the refusal.
 *
 * usage, from E:/atlas/website: npm run launch:branch    (then, on his word: git push origin launch-day:main)
 */
import { execFileSync } from "node:child_process";
import { rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const PRIVATE_KEY = "NEXT_PUBLIC_SITE_PRIVATE=";
const ENV_FILE = ".env.production";
const INHERITED = ["GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE", "GIT_OBJECT_DIRECTORY", "GIT_ALTERNATE_OBJECT_DIRECTORIES", "GIT_COMMON_DIR", "GIT_NAMESPACE"];

/** The environment git runs in: the caller's, without inherited repository variables, plus `extra`. */
export function gitEnv(extra = {}) {
  const env = { ...process.env };
  for (const key of INHERITED) delete env[key];
  return { ...env, ...extra };
}

function run(cwd, args, { input, env, encoding = "utf8" } = {}) {
  return execFileSync("git", args, { cwd, input, env: env ?? gitEnv(), encoding, stdio: ["pipe", "pipe", "pipe"] });
}

/** The env file without its private line, every other line keeping its own ending; throws unless exactly one line sets the key. */
export function withoutPrivateLine(text) {
  const lines = text.split(/(?<=\n)/);
  const isKey = (line) => line.trim().startsWith(PRIVATE_KEY);
  const hits = lines.filter(isKey).length;
  if (hits !== 1) throw new Error(`expected exactly one ${PRIVATE_KEY} line in ${ENV_FILE}, found ${hits}`);
  return lines.filter((line) => !isKey(line)).join("");
}

export function rebuildLaunchBranch({ cwd = process.cwd(), base = "main", branch = "launch-day" } = {}) {
  const git = (args, opts) => run(cwd, args, opts).trim();
  const baseSha = git(["rev-parse", "--verify", `${base}^{commit}`]);
  if (git(["worktree", "list", "--porcelain"]).split("\n").includes(`branch refs/heads/${branch}`)) {
    throw new Error(`${branch} is checked out in a worktree; switch that worktree away before rebuilding the branch`);
  }
  const mode = git(["ls-tree", baseSha, "--", ENV_FILE]).split(/\s+/)[0];
  if (mode !== "100644" && mode !== "100755") throw new Error(`${ENV_FILE} is missing from ${base} or is not a regular file`);
  const source = run(cwd, ["cat-file", "blob", `${baseSha}:${ENV_FILE}`], { encoding: "buffer" }).toString("latin1");
  const blob = git(["hash-object", "-w", "--stdin"], { input: Buffer.from(withoutPrivateLine(source), "latin1") });
  const index = resolve(cwd, git(["rev-parse", "--git-dir"]), "launch-branch.index");
  const env = gitEnv({ GIT_INDEX_FILE: index });
  let tree;
  try {
    rmSync(index, { force: true });
    git(["read-tree", baseSha], { env });
    git(["update-index", "--cacheinfo", `${mode},${blob},${ENV_FILE}`], { env });
    tree = git(["write-tree"], { env });
  } finally {
    rmSync(index, { force: true });
  }
  /* The line the command prints, proven before the branch moves: one line out of the env file, nothing else in the tree. */
  const numstat = git(["diff-tree", "--numstat", "-r", baseSha, tree]);
  if (numstat !== `0\t1\t${ENV_FILE}`) {
    throw new Error(`the rebuilt tree is not one deleted line of ${ENV_FILE} away from ${base} (diff-tree --numstat: "${numstat.replace(/\s+/g, " ")}")`);
  }
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
  try {
    const { base, commit } = rebuildLaunchBranch();
    console.log(`launch-day: ${commit.slice(0, 8)}, one commit on main ${base.slice(0, 8)} that deletes the private line and adds nothing`);
    console.log("Push it on launch day, after his review: git push origin launch-day:main");
  } catch (err) {
    console.error(`launch:branch: ${err instanceof Error ? err.message.split("\n")[0] : String(err)}. The branch was not moved.`);
    process.exitCode = 1;
  }
}
