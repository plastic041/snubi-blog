import { PrismaClient } from ".prisma/client";
import fs from "fs/promises";
import invariant from "tiny-invariant";
import { marked } from "marked";
import matter from "gray-matter";
import path from "path";

const prisma = new PrismaClient();

// import remarkImgload from "rehype-imgload";
// import rehypeStringify from "rehype-stringify";
// import remarkParse from "remark-parse";
// import { unified } from "unified";
// import remarkRehype from "remark-rehype";

export type PostMeta = {
  title: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isShow: boolean;
};

export type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isShow: boolean;
};

export type PostMarkdown = PostMeta & {
  markdown: string;
};

export type PostHTML = PostMeta & {
  html: string;
};

const postsPath = path.join(__dirname, "../../posts");
// const postsPath = "api/posts";
// const postsPath = path.join("posts");

const isValidPost = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: any
): attributes is PostMeta => {
  return attributes?.title;
};

export const getPosts = async (): Promise<PostMeta[]> => {
  const allPosts = await prisma.post.findMany();

  const dir = await fs.readdir(postsPath);
  const posts = await Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(postsPath, filename), "utf8");
      const { data } = matter(file);
      invariant(isValidPost(data), `Invalid post attributes: ${filename}`);

      return {
        slug: filename.replace(/\.md$/, ""),
        title: data.title,
        description: data.description,
        createdAt: data.createdAt,
      };
    })
  );

  const postSorted = posts.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return postSorted;
};

export const getPost = async (slug: string): Promise<PostHTML> => {
  const filepath = path.join(postsPath, `${slug}.md`);
  const file = await fs.readFile(filepath, "utf8");
  const { data, content } = matter(file);

  // validate post attributes
  invariant(isValidPost(data), `Invalid post attributes: ${filepath}`);

  // const processor = unified()
  //   .use(remarkParse)
  //   .use(remarkRehype, { allowDangerousHtml: true })
  //   .use(rehypeImgLoad)
  //   .use(rehypeStringify, { allowDangerousHtml: true });

  // const html = processor.processSync(content).value as string;
  const html = marked(content);

  return {
    slug,
    title: data.title,
    html,
    description: data.description,
    createdAt: data.createdAt,
  };
};

export const getPostWithMarkDown = async (
  slug: string
): Promise<PostMarkdown> => {
  const filepath = path.join(postsPath, `${slug}.md`);
  const file = await fs.readFile(filepath, "utf8");
  const { data, content } = matter(file);

  // validate post attributes
  invariant(isValidPost(data), `Invalid post attributes: ${filepath}`);

  return {
    slug,
    title: data.title,
    markdown: content,
    createdAt: data.createdAt,
    description: data.description,
  };
};
