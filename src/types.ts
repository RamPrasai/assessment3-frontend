export type Post = {
    id: number;
    title: string;
    body?: string | null;     // some schemas use "body"
    content?: string | null;  // yours uses "content" (from the API response)
    category_id?: number | null;
    is_active?: string | boolean | null;
    created_at?: string;
    updated_at?: string;
};

// Helper to read whichever content field exists
export const readContent = (p: Post) => p.body ?? p.content ?? "";
