
app/authenticated/
├── posts/
│   ├── new/
│   │   └── page.tsx                    # Route: /authenticated/posts/new?type=lost|found
│   ├── actions.ts                      # Server actions (createPost, uploadImage)
│   └── components/
│       └── PostForm.tsx                # Reusable form (handles both lost/found)
└── layout.tsx