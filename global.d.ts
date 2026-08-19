type AuthMode = "signUp" | "signIn";

type SupabaseSchema = Record<string, never>;

type PostType = "lost" | "found";

interface PostForm {
    itemName: string;
    category: string | null;
    date: string;
    location: string;
    description: string;
    image: Blob | null;
}
