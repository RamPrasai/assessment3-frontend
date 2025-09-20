// src/pages/PostView.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Alert, Spinner, Button, Stack } from "react-bootstrap";
import api from "@/lib/api";
import type { Post } from "../types";
import { readContent } from "../types";

export default function PostView() {
  const { id } = useParams();
  const nav = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setLoading(true);

    // Guard: id must be numeric
    if (!id || !/^\d+$/.test(id)) {
      setError("Invalid post id.");
      setLoading(false);
      return;
    }

    api
      .get<Post>(`/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => {
        const status = err?.response?.status;
        setError(
          status === 404
            ? "Post not found."
            : err?.response?.data?.message ?? err.message ?? "Failed to load post."
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container className="py-4 d-flex align-items-center gap-2">
        <Spinner animation="border" /> <span>Loading…</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
        <Button variant="secondary" onClick={() => nav(-1)}>
          Go back
        </Button>
      </Container>
    );
  }

  if (!post) return null;

  return (
    <Container className="py-4">
      <Stack gap={3}>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="m-0">{post.title}</h2>
          <div>
            {/* Wrap Buttons with <Link> instead of using as={Link} */}
            <Link to={`/post/edit/${post.id}`} style={{ textDecoration: "none" }}>
              <Button variant="warning" className="me-2">Edit</Button>
            </Link>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button variant="secondary">Back to list</Button>
            </Link>
          </div>
        </div>

        <div style={{ whiteSpace: "pre-wrap" }}>
          {readContent(post)}
        </div>

        <small className="text-muted">
          ID: {post.id}
          {post.updated_at ? ` • Updated ${new Date(post.updated_at).toLocaleString()}` : ""}
        </small>
      </Stack>
    </Container>
  );
}
