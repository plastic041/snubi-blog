import type { LinksFunction, LoaderFunction, MetaFunction } from "remix";

import type { PostHTML } from "~/post";
import PostStyles from "~/styles/post.css";
import { getPost } from "~/post";
import invariant from "tiny-invariant";
import { useLoaderData } from "remix";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: PostStyles }];
};

export const loader: LoaderFunction = ({ params }) => {
  invariant(params.slug, "slug is required");
  const post = getPost(params.slug);
  return post;
};

export const meta: MetaFunction = ({ data }: { data: PostHTML }) => {
  return {
    title: `스넙 | ${data.title}`,
    description: data.title,
    "twitter:card": "summary",
    "twitter:creator": "스넙",
    "twitter:title": data.title,
    "twitter:description": data.description,
    "og:title": data.title,
    "og:description": data.description,
    "og:type": "article",
    "og:url": `https://snubi-blog.vercel.app/post/${data.slug}`,
    "article:published_time": data.createdAt,
    "article:author": "스넙",
  };
};

const PostSlug = () => {
  const post = useLoaderData<PostHTML>();
  return (
    <main className="post">
      <article>
        <div className="post__info">
          <h1 className="post__info-title">{post.title}</h1>
          <time className="post__info-date" dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString()}
          </time>
        </div>
        <div
          className="post__body"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </main>
  );
};

export default PostSlug;
