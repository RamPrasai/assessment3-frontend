import { useState } from "react";
import { Container, Form, Button, Stack, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import type { Post } from "../types";

type Errors = Record<string, string[]>;

export default function PostCreate() {
    const nav = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Errors>({});

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setErrors({});
        setSubmitting(true);
        try {
            // Send both fields so it works whether your backend expects `content` or `body`
            const payload = { title, content, body: content };
            const res = await api.post<Post>("/posts", payload);
            nav(`/post/${res.data.id}`);
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? err.message ?? "Failed to create the post.";
            setError(msg);
            const v = err?.response?.data?.errors;
            if (v && typeof v === "object") setErrors(v as Errors);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Container className="py-4">
            <h2 className="mb-3">Create Post</h2>

            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
                <Stack gap={3}>
                    <Form.Group controlId="createTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            isInvalid={!!errors.title}
                            placeholder="Post title"
                            disabled={submitting}
                        />
                        {errors.title?.map((m, i) => (
                            <Form.Control.Feedback key={i} type="invalid">
                                {m}
                            </Form.Control.Feedback>
                        ))}
                    </Form.Group>

                    <Form.Group controlId="createContent">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            required
                            rows={6}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            isInvalid={!!errors.content || !!errors.body}
                            placeholder="Write something…"
                            disabled={submitting}
                        />
                        {[...(errors.content ?? []), ...(errors.body ?? [])].map((m, i) => (
                            <Form.Control.Feedback key={i} type="invalid">
                                {m}
                            </Form.Control.Feedback>
                        ))}
                    </Form.Group>

                    <div>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Creating…" : "Create"}
                        </Button>
                        <Button
                            className="ms-2"
                            variant="secondary"
                            type="button"
                            onClick={() => nav(-1)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                    </div>
                </Stack>
            </Form>
        </Container>
    );
}
