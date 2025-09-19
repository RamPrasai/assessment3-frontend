import { useEffect, useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import type { Post } from "../types";
import { readContent } from "../types";

type Props = {
    initial?: Post | null;
    submitLabel?: string;
    onSubmit: (data: { title: string; body?: string; content?: string }) => Promise<void> | void;
};

export default function PostForm({ initial, onSubmit, submitLabel = "Save" }: Props) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [content, setContent] = useState(readContent(initial ?? ({} as Post)));
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (initial) {
            setTitle(initial.title ?? "");
            setContent(readContent(initial));
        }
    }, [initial]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            // backend accepts either "body" or "content" — send both
            await onSubmit({ title, body: content, content });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={3}>
                <Form.Group controlId="postTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Post title"
                    />
                </Form.Group>

                <Form.Group controlId="postContent">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        required
                        rows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write something…"
                    />
                </Form.Group>

                <div>
                    <Button type="submit" disabled={submitting}>
                        {submitLabel}
                    </Button>
                </div>
            </Stack>
        </Form>
    );
}
