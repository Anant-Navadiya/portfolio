insert into article_categories (slug, label, description, sort_order) values
  ('ai', 'AI', 'AI notes, concepts, implementations, and experiments.', 0)
on conflict (slug) do update set
  label = excluded.label,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into article_subcategories (slug, category_slug, label, sort_order) values
  ('basics', 'ai', 'Basics', 0),
  ('models', 'ai', 'Models', 10)
on conflict (slug) do update set
  category_slug = excluded.category_slug,
  label = excluded.label,
  sort_order = excluded.sort_order;

insert into article_posts (
  slug,
  title,
  description,
  status,
  category_slug,
  subcategory_slug,
  published_at,
  image_url,
  image_alt
) values
  (
    'introduction-of-ai',
    'What Is AI?',
    'A beginner-friendly walkthrough of what artificial intelligence actually is, how it differs from ordinary software, and where AI, machine learning, deep learning, and LLMs fit together.',
    'published',
    'ai',
    'basics',
    '2026-08-12T09:00:00Z',
    null,
    null
  ),
  (
    'how-llms-work',
    'How LLMs Work',
    'A plain-language walkthrough of what actually happens between typing a prompt and a large language model typing back an answer: tokens, embeddings, attention, and why they sometimes make things up.',
    'published',
    'ai',
    'models',
    '2026-08-12T10:00:00Z',
    null,
    null
  ),
  (
    'attention-mechanism',
    'Scaled Dot-Product Attention',
    'A compact note on the attention equation, why scaling matters, and how to read the tensor shapes.',
    'published',
    'ai',
    'models',
    '2026-07-03T00:00:00Z',
    null,
    null
  )
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  status = excluded.status,
  category_slug = excluded.category_slug,
  subcategory_slug = excluded.subcategory_slug,
  published_at = excluded.published_at,
  image_url = excluded.image_url,
  image_alt = excluded.image_alt,
  updated_at = now();

delete from article_post_tags where post_slug in ('introduction-of-ai', 'how-llms-work', 'attention-mechanism');

insert into article_post_tags (post_slug, tag) values
  ('introduction-of-ai', 'ai'),
  ('introduction-of-ai', 'machine-learning'),
  ('introduction-of-ai', 'beginners'),
  ('how-llms-work', 'llm'),
  ('how-llms-work', 'transformers'),
  ('how-llms-work', 'machine-learning'),
  ('how-llms-work', 'beginners'),
  ('attention-mechanism', 'attention'),
  ('attention-mechanism', 'transformers'),
  ('attention-mechanism', 'math')
on conflict (post_slug, tag) do nothing;

insert into article_post_stats (post_slug) values
  ('introduction-of-ai'),
  ('how-llms-work'),
  ('attention-mechanism')
on conflict (post_slug) do nothing;
