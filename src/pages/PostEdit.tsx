// src/pages/PostEdit.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Container, Alert, Spinner, Form, Button, Stack } from "react-bootstrap";
import api from "@/lib/api";
import type { Post } from "../types";

type Errors = Record<string, string[]>;

export default function PostEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const fetchPost = useCallback(async () => {
    setError(null);
    setSuccess(null);

    // Guard: id must be numeric
    if (!id || !/^\d+$/.test(id)) {
      setLoading(false);
      setError("Invalid post id.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get<Post>(`/posts/${id}`);
      setPost(res.data);
      setTitle(res.data.title ?? "");
      setContent((res.data as any).content ?? (res.data as any).body ?? "");
    } catch (err: any) {
      const status = err?.response?.status;
      setError(
        status === 404
          ? "Post not found."
          : err?.response?.data?.message ?? err.message ?? "Failed to load post."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchPost(); }, [fetchPost]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    setErrors({});
    try {
      // send both fields for compatibility
      const payload = { title, content, body: content };
      const res = await api.put<Post>(`/posts/${id}`, payload);
      setPost(res.data);
      setSuccess("Post updated successfully.");
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message ?? err.message ?? "Update failed.";
      setError(status === 404 ? "Post not found." : message);
      const v = err?.response?.data?.errors;
      if (v && typeof v === "object") setErrors(v as Errors);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Container className="py-4 d-flex align-items-center gap-2">
        <Spinner animation="border" /> <span>Loading…</span>
      </Container>
    );
  }

  if (error && !post) {
    return (
      <Container className="py-4">
        <Alert variant="danger" className="mb-3">{error}</Alert>
        <Button variant="secondary" onClick={() => nav(-1)}>Go back</Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* header with Back to list */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 m-0">Edit Post</h1>
        {/* Wrap the Button with <Link> instead of as={Link} */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button variant="secondary">Back to list</Button>
        </Link>
      </div>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
          {success}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {post && (
        <Form onSubmit={handleSubmit} noValidate>
          <Stack gap={3}>
            <Form.Group controlId="editTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                isInvalid={!!errors.title}
                disabled={saving}
              />
              {errors.title?.map((m, i) => (
                <Form.Control.Feedback key={i} type="invalid">
                  {m}
                </Form.Control.Feedback>
              ))}
            </Form.Group>

            <Form.Group controlId="editContent">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                isInvalid={!!errors.content || !!errors.body}
                disabled={saving}
              />
              {[...(errors.content ?? []), ...(errors.body ?? [])].map((m, i) => (
                <Form.Control.Feedback key={i} type="invalid">
                  {m}
                </Form.Control.Feedback>
              ))}
            </Form.Group>

            <div>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
              <Button
                className="ms-2"
                variant="outline-secondary"
                type="button"
                onClick={() => nav(-1)}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </Stack>
        </Form>
      )}
    </Container>
  );
}
