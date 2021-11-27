import type { LinksFunction, LoaderFunction, MetaFunction } from "remix";
import { PostMeta, getPosts } from "~/post";

import PostList from "~/components/PostList";
import PostListStyles from "~/styles/post-list.css";
import { useLoaderData } from "remix";

export const loader: LoaderFunction = async () => {
  return getPosts();
};

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => {
  return {
    title: "스넙 블로그",
    description: "스넙의 블로그 글 목록",
    "twitter:card": "summary",
    "twitter:creator": "스넙",
    "twitter:title": "스넙 블로그",
    "twitter:description": "스넙의 블로그 글 목록",
    "og:title": "스넙 블로그",
    "og:description": "스넙의 블로그 글 목록",
    "og:type": "website",
    "og:url": "https://snubi-blog.vercel.app/",
  };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: PostListStyles }];
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const posts = useLoaderData<PostMeta[]>();

  return (
    <main>
      <PostList posts={posts} />
    </main>
  );
}
