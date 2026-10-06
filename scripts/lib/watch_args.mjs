/**
 * THE WATCHER'S ARGUMENTS (2026-10-06). deploy:watch read the address from --url and launch:check from --marker-url, and
 * LAUNCH-SWITCHES row 13 passes --marker-url to both, so the watcher polled /gb for a line only the home page prints and
 * would have reported a good launch as unseen. Either flag names the address now. Git Bash rewrites a bare "/" argument
 * into a Windows folder ("C:/Program Files/Git/") before node sees it; such a value is refused with the remedy instead of
 * being fetched as an unknown scheme until the deadline.
 */
export function shellMangled(value) {
  return /^[A-Za-z]:[\\/]/.test(String(value ?? ""));
}

export function watchArgs(argv, site = "https://marginatlas.com") {
  const arg = (k) => {
    const a = argv.find((x) => x.startsWith(`--${k}=`));
    return a ? a.slice(k.length + 3) : null;
  };
  const path = arg("url") ?? arg("marker-url") ?? "/gb";
  if (shellMangled(path)) {
    return { error: `the address arrived as "${path}": Git Bash turned "/" into a folder. Run the command from PowerShell, or prefix it with MSYS_NO_PATHCONV=1` };
  }
  return { marker: arg("marker"), url: new URL(path, site).href, minutes: Number(arg("minutes") ?? "15") };
}
