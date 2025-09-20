// src/pages/PostList.tsx
import { useEffect, useState, useCallback } from "react";
import { Button, Container, Table, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import type { Post } from "../types";
import { readContent } from "../types";

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Post[]>("/posts");
      setPosts(res.data ?? []);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err.message ?? "Failed to load posts.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // removed unused `active` flag
    (async () => {
      await load();
    })();
  }, [load]);

  async function handleDelete(id: number) {
    setDeleteError(null);
    if (!window.confirm("Delete this post?")) return;

    // Optimistic update with rollback
    const prev = posts;
    setDeletingId(id);
    setPosts((ps) => ps.filter((p) => p.id !== id));
    try {
      await api.delete(`/posts/${id}`);
    } catch (err: any) {
      // rollback on failure
      setPosts(prev);
      const msg = err?.response?.data?.message ?? err.message ?? "Failed to delete.";
      setDeleteError(msg);
    } finally {
      setDeletingId(null);
    }
  }

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
        <Alert variant="danger" className="d-flex justify-content-between align-items-center">
          <div>{error}</div>
          <Button size="sm" variant="light" onClick={load}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Posts</h2>
        {/* Wrap the Button with <Link> instead of using `as={Link}` */}
        <Link to="/post/create" style={{ textDecoration: "none" }}>
          <Button>+ New Post</Button>
        </Link>
      </div>

      {deleteError && (
        <Alert
          variant="warning"
          onClose={() => setDeleteError(null)}
          dismissible
          className="mb-3"
        >
          {deleteError}
        </Alert>
      )}

      {posts.length === 0 ? (
        <Alert variant="info">No posts yet. Create your first one!</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th style={{ width: 70 }}>ID</th>
              <th>Title</th>
              <th>Excerpt</th>
              <th style={{ width: 260 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.title}</td>
                <td
                  style={{
                    maxWidth: 420,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={readContent(p) || undefined}
                >
                  {readContent(p)}
                </td>
                <td>
                  {/* Use flex + gap instead of ButtonGroup so Links can wrap Buttons */}
                  <div className="d-flex gap-2">
                    <Link to={`/post/${p.id}`} style={{ textDecoration: "none" }}>
                      <Button size="sm" variant="secondary" disabled={deletingId === p.id}>
                        View
                      </Button>
                    </Link>

                    <Link to={`/post/edit/${p.id}`} style={{ textDecoration: "none" }}>
                      <Button size="sm" variant="warning" disabled={deletingId === p.id}>
                        Edit
                      </Button>
                    </Link>

                    <Button
                      onClick={() => handleDelete(p.id)}
                      size="sm"
                      variant="danger"
                      disabled={deletingId === p.id}
                    >
                      {deletingId === p.id ? "Deleting…" : "Delete"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
