import { Link } from "remix";
import type { PostMeta } from "~/post";

type Props = {
  posts: PostMeta[];
};

const PostList = ({ posts }: Props) => {
  return (
    <ul className="post-list">
      {posts.map((post) => {
        return (
          <li key={post.slug} className="post-list__item">
            <Link to={`/post/${post.slug}`} className="post-list__item-link">
              <span className="post-list__item-link-title">{post.title}</span>
              <time
                className="post-list__item-link-date"
                dateTime={post.createdAt}
              >
                {new Date(post.createdAt).toLocaleDateString()}
              </time>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default PostList;
