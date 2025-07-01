import React from 'react';
import BlogPostPaginator from '@theme-original/BlogPostPaginator';
import { Comments } from "../../components/Comments";

export default function BlogPostPaginatorWrapper(props) {
  return (
    <>
      <BlogPostPaginator {...props} />
      <div style={{ paddingTop: '2rem' }}>
        <Comments />
      </div>
    </>
  );
}
