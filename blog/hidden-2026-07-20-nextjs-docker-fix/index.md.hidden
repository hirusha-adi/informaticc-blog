---
title: Debugging a Docker build that silently dropped all CSS
authors: [hirusha]
tags: [nextjs,docker,troubleshooting,debugging,webdev]
---

I had a bug that looked simple and turned out to be two unrelated bugs wearing a trench coat. The symptom: `pnpm run build` on a laptop produced a perfectly normal Next.js app, styles and all. The exact same code, built inside the Docker image we ship to production, produced an app with **zero CSS**. Not broken CSS  no CSS. No `<link>` tags pointing to missing files, no 404s, nothing. The build didn't even try.

![alt text](image.png)

This is the story of tracking that down, because the actual cause was strange enough that it's worth writing up.

<!--truncate-->


## The setup

The app is a Next.js 15 project (App Router) using Tailwind, shadcn, and Sentry. The Dockerfile was simple:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
```

Build it, copy the static output into a standalone runtime folder, run `node server.js`. Nothing exotic.

Locally, `pnpm run build` had always worked. In Docker, the build finished with `✓ Compiled successfully`, generated all 26 pages, printed a normal route size table  and produced a `.next/static` directory with a `chunks/` folder and nothing else. No `css/` folder at all.

## Bug #1: a lockfile that lied

The first thing to notice was that the Dockerfile used `npm ci`, but the repo had migrated to pnpm  there was a `pnpm-lock.yaml` sitting right next to a stale `package-lock.json` from before the switch. Nobody had updated the Dockerfile.

That stale lockfile pinned `shadcn` at version `4.11.0`. The app's `globals.css` does this:

```css
@import "shadcn/tailwind.css";
```

Version `4.11.0` of the `shadcn` package has a `package.json` `exports` map that looks like this:

```json
"./tailwind.css": {
  "style": "./dist/tailwind.css"
}
```

That only exposes the file under a `style` condition. Next's webpack CSS resolver doesn't request that condition when resolving `@import` statements, so this import silently fails to resolve for anyone locked to that exact version.

Locally, `pnpm-lock.yaml` had resolved `shadcn` to `4.13.0`, where the same export is just:

```json
"./tailwind.css": "./dist/tailwind.css"
```

No condition gating  it resolves for anyone. That's why local builds were fine and the stale-lockfile Docker build wasn't: two different `shadcn` versions, only one of which exposes its CSS file the way Next expects.

**Fix, part one:** stop using `npm ci` against an abandoned lockfile. Switch the Dockerfile to pnpm:

```dockerfile
RUN corepack enable && corepack prepare pnpm@10 --activate
RUN pnpm install --frozen-lockfile && pnpm run build
```

(pnpm 10, not `latest`  pnpm 11+ requires Node 22, and the base image is `node:20-alpine`. Also not pnpm 9  the project's `pnpm-workspace.yaml` only has an `allowBuilds` block and no `packages` field, which pnpm 9 refuses to install with a "packages field missing or empty" error; 10 and 11 both tolerate it.)

Deleted the orphaned `package-lock.json` so nothing can silently fall back to `npm ci` again.

Rebuilt. **Still zero CSS.**

## Bug #2: the one that didn't make sense

This is where it got interesting. Fixing the lockfile issue was necessary but not sufficient  something else, independent of package versions, was eating the CSS.

The build gave no errors, no warnings, nothing CSS-related in the log at all. That absence turned out to be the most useful clue, once I started chasing it directly instead of trusting the log to tell me anything.

### Ruling things out, one at a time

I patched `postcss.config.js` to add a `console.error` at the top of the file, to check whether it was even being loaded during the build:

```js
console.error(">>> POSTCSS CONFIG EXECUTED");
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

It never printed. Not once, in any of the three parallel webpack compiler passes (client/server/edge) Next runs during a build. Whatever was going wrong, it was happening *before* PostCSS ever got a chance to run  the CSS file wasn't reaching the loader chain at all.

Digging into Next's bundled webpack config (`node_modules/next/dist/build/webpack/config/blocks/css/index.js`), I confirmed the CSS rules and `MiniCssExtractPlugin` genuinely were being registered in the config  I logged the live webpack config from inside a `next.config.js` `webpack()` hook and saw `cssOneOfCount=14` and `NextMiniCssExtractPlugin` present in the plugin list. So the machinery was wired up correctly. The problem was downstream: nothing was ever handed to it.

From there I went through the usual list of "things that behave differently in Docker" and eliminated every one of them empirically, by building inside `node:20-alpine` and `node:20` (Debian, glibc) containers and diffing against a bare-metal build:

- **Node version**  reproduced identically on Node 20 and Node 22 inside Docker; also reproduced with **Node 20 on the host** outside Docker was fine. So it wasn't Node version.
- **musl vs glibc**  reproduced on both Alpine (musl) and Debian (glibc) base images. Not libc.
- **npm vs pnpm**  reproduced even after switching fully to pnpm with the correct lockfile. Not the package manager.
- **Environment variables**  ran the host build inside `env -i` with a stripped-down environment (no shell profile, no editor/desktop variables). Still worked. Not env vars.
- **Sentry's webpack plugin**  stripped `withSentryConfig()` out of `next.config.js` entirely. Still broken in Docker. Not Sentry.
- **`output: 'standalone'`**  removed it. Still broken. Not the standalone file-tracing step.
- **Webpack's persistent cache**  forced `config.cache = false`. Still broken. Not stale cache.
- **Build parallelism**  set `experimental.cpus: 1` and `experimental.workerThreads: false` to force a single-threaded build. Still broken. Not a worker race condition.
- **PID 1 / signal handling**  ran with Docker's `--init` flag (gives the process a real init as PID 1 instead of Node itself). Still broken.
- **PID namespace**  ran with `--pid=host`. Still broken.
- **`/dev/shm` size** (famously capped at 64MB by default in Docker)  ran with `--shm-size=2g`. Still broken.
- **Open file descriptor limit**  this one looked promising: Docker's default is `ulimit -n 1024`, versus `524288` on the host, and a webpack build touching hundreds of `node_modules` packages across three parallel compilations is exactly the kind of thing that could hit that ceiling. Raised it explicitly with `--ulimit nofile=524288:524288`. Still broken.
- **Seccomp / capabilities**  ran fully `--privileged`. Still broken.

At this point I had a container that shared the host's PID namespace, had elevated privileges, generous file descriptor limits, and a huge `/dev/shm`, and it *still* produced zero CSS while the exact same source and `node_modules` on bare metal worked fine. That ruled out effectively the entire category of "container resource/namespace weirdness."

### The actual variable

The one thing I hadn't varied yet was the working directory itself. On a hunch, I reran the build with the container's working directory bind-mounted at `/build` instead of `/app`  everything else identical, same image, same `node_modules`, same source tree.

**CSS appeared.**

That was surprising enough that I didn't believe it at first, so I tested a matrix of paths:

| Working directory | CSS generated? |
|---|---|
| `/app` | ❌ No |
| `/build` | ✅ Yes |
| `/apps` | ✅ Yes |
| `/x` | ✅ Yes |
| `/srv/app` | ✅ Yes |
| `/usr/src/app` | ✅ Yes |

Only the literal, exact, top-level path `/app` broke it. Not "any path ending in app," not "any short path"  specifically the single directory `/app`, sitting directly under the filesystem root.

### Why `/app` is special for *this* project

Here's the part that made it click: this app has an authenticated section of the site routed at `/app`  in App Router terms, that's a folder literally named `app` nested one level inside the router's own `app/` directory: `app/app/carrier`, `app/app/filter`, `app/app/lookup`, `app/app/stats`, and so on.

Put those two facts together. Next's App Router convention is that route files live in `<project root>/app/`. If the project root  the Docker container's working directory  is *also* named `/app`, then the absolute path to the app's root layout becomes:

```
/app          <- container WORKDIR (the "project root")
  /app        <- Next.js App Router convention directory
    layout.js <- imports ./globals.css
```

i.e. `/app/app/layout.js`. And the nested authenticated section makes it worse  its route files sit at `/app/app/app/carrier/page.js`, with the literal string `app` repeated three times in the absolute path.

I went looking for the exact line in Next.js's webpack config assembly that gets confused by this  there's a good candidate in `next/dist/build/webpack/config/blocks/css/index.js`, where Next decides whether a global CSS import is "allowed" based on whether the importing file's path is contained within the project's root directory (`ctx.rootDirectory`) and matches the app's layout file pattern. That logic does path containment and pattern checks against absolute paths, and I confirmed by testing `/apps`, `/srv/app`, and `/usr/src/app` (all of which also produce an "app/app" collision somewhere in the tree, since they all end in a directory named `app`) that **none of those break it**  only the exact top-level `/app` does. That narrows it to something that treats `/app` as a special, singular value, not a general "path contains 'app' twice" pattern-matching bug.

I wasn't able to pin the exact source line responsible  it's buried in minified, aggressively-inlined build tooling across Next.js, webpack, and possibly a transitive dependency, and I ran out of appetite for bisecting a minifier's output by hand. But I don't need the exact line to have a confirmed, reproducible, and fully isolated trigger: **container working directory equal to exactly `/app`, on a project whose App Router directory is also named `app`, silently disables Next's built-in CSS extraction with no error of any kind.** That's a strange enough coincidence of naming that it's very unlikely to bite a project that isn't shaped like this one  but this one is, because `/app` is also this app's *own URL namespace* (`/app/carrier`, `/app/stats`, etc.), so the collision was baked into the product from day one.

## The fix

Two lines, in the end:

```diff
 FROM node:20-alpine

-WORKDIR /app
+WORKDIR /build
+
+RUN corepack enable && corepack prepare pnpm@10 --activate

 COPY . .

-RUN npm ci && npm run build
+RUN pnpm install --frozen-lockfile && pnpm run build
```

Plus deleting the stale `package-lock.json`.

## Why this fix actually fixes it

- **Switching to pnpm** resolves `shadcn` to the version the project was actually developed and tested against (`4.13.0`), whose `./tailwind.css` export isn't gated behind a condition Next never requests. This is the straightforward, fully-understood half of the fix.
- **Moving `WORKDIR` off `/app`** breaks the path collision between the container's project root and this app's App Router directory (which is also, coincidentally, this app's own route namespace). With the project root at `/build`, the root layout lives at `/build/app/layout.js`  a normal, unambiguous path with no repeated segment for anything to get confused by. I verified this empirically across a wide matrix of container configurations (privileges, namespaces, ulimits, cache settings, worker counts) that all eliminated as *not* the cause, leaving working-directory naming as the only variable that mattered.

## Takeaways

1. **A Docker image is not "the same build" as your laptop just because the source is identical.** Lockfile drift between package managers is an easy, boring way for that assumption to quietly stop being true  and boring bugs are exactly the ones worth double-checking first.
2. **"Compiled successfully" is not proof of anything except that nothing threw.** A build step can silently produce empty output while reporting total success. If a build "works" but the artifact is wrong, don't trust the log  check the artifact.
3. **`/app` is an extremely popular Docker convention.** It's the default `WORKDIR` in more Dockerfile tutorials than any other path. If your project's own URL structure, route names, or directory conventions happen to collide with that convention, you may be one `WORKDIR` line away from a very confusing bug. Naming your working directory something boring and specific (`/build`, `/srv/<app-name>`) costs nothing and removes an entire, hard-to-imagine class of collision.
4. **When a bug doesn't reproduce outside a container, vary the container, not just the code.** The actual variable here wasn't in `next.config.js`, `package.json`, or any application file  it was a single word in a `WORKDIR` directive that happened to match a folder name three levels deep in the project it was building.

