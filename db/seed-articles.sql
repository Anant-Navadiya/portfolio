insert into article_categories (slug, label, description, sort_order) values
  ('ai', 'AI', 'AI notes, concepts, implementations, and experiments.', 10),
  ('web', 'Web', 'Frontend, backend, performance, and application architecture notes.', 20),
  ('systems', 'Systems', 'Databases, infrastructure, tooling, and lower-level engineering notes.', 30),
  ('experiments', 'Experiments', 'Small builds, evaluations, and lessons from trying things.', 40)
on conflict (slug) do update set
  label = excluded.label,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into article_subcategories (slug, category_slug, label, sort_order) values
  ('models', 'ai', 'Models', 10),
  ('agents', 'ai', 'Agents', 20),
  ('ml-systems', 'ai', 'ML Systems', 30),
  ('frontend', 'web', 'Frontend', 10),
  ('backend', 'web', 'Backend', 20),
  ('databases', 'systems', 'Databases', 10),
  ('tooling', 'systems', 'Tooling', 20),
  ('implementations', 'experiments', 'Implementations', 10),
  ('evaluations', 'experiments', 'Evaluations', 20)
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
) values (
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
  image_alt = excluded.image_alt;

insert into article_post_tags (post_slug, tag) values
  ('attention-mechanism', 'attention'),
  ('attention-mechanism', 'transformers'),
  ('attention-mechanism', 'math')
on conflict (post_slug, tag) do nothing;

insert into article_post_stats (post_slug) values
  ('attention-mechanism')
on conflict (post_slug) do nothing;
