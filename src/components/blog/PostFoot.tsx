/**
 * THE FOOT OF A POST (P36.1, the rewrites of 2026-10-06; BLOG.md: "Each piece ends with the same four plain blocks, never a sales
 * line"). The pages its figures live on, the data pack's files they come from, the method on About the figures, then the post's
 * two true lines (drafted with AI assistance; every figure checked against the pack) and the UK pages' one line of sources (his
 * R-002 ruling: the sources are named on one page, and this line links there, as every UK page's foot does). No guide block: the
 * guides hub is a plan (GUIDES.md). Nothing prints for a post that carries none of it.
 */
import * as React from "react";
import { BLOG_AI_LINE, BLOG_CHECKED_LINE, type BlogPost } from "@/lib/blog";
import { PACK_VERSION, packHref } from "@/lib/data_pack";
import { UK_SOURCES_FOOT } from "@/lib/spine/uk_sources";

export function PostFoot({ post }: { post: BlogPost }) {
  const behind = post.behind ?? [];
  const data = post.data ?? [];
  if (behind.length === 0 && data.length === 0 && !post.method && !post.ai) return null;
  return (
    <>
      <dl>
        {behind.length > 0 ? (
          <div>
            <dt>Figures behind this</dt>
            <dd>
              {behind.map((l, i) => (
                <React.Fragment key={l.href}>
                  {i > 0 ? ", " : null}
                  <a href={l.href}>{l.label}</a>
                </React.Fragment>
              ))}
            </dd>
          </div>
        ) : null}
        {data.length > 0 ? (
          <div>
            <dt>Data</dt>
            <dd>
              {data.map((f, i) => (
                <React.Fragment key={f}>
                  {i > 0 ? ", " : null}
                  <a href={packHref(f)}>{f}</a>
                </React.Fragment>
              ))}
              , from the <a href="/data">free UK data pack</a>, version {PACK_VERSION}
            </dd>
          </div>
        ) : null}
        {post.method ? (
          <div>
            <dt>Method</dt>
            <dd>
              <a href={post.method.href}>{post.method.label}</a>
            </dd>
          </div>
        ) : null}
      </dl>
      {post.ai || data.length > 0 ? (
        <p>
          {post.ai ? BLOG_AI_LINE : null}
          {post.ai && data.length > 0 ? " " : null}
          {data.length > 0 ? BLOG_CHECKED_LINE : null}
        </p>
      ) : null}
      {data.length > 0 ? (
        <p>
          {UK_SOURCES_FOOT.line} <a href={UK_SOURCES_FOOT.href}>{UK_SOURCES_FOOT.link}</a>
        </p>
      ) : null}
    </>
  );
}
