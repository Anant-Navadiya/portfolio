insert into article_categories (slug, label, description, sort_order) values
  ('ml', 'Machine Learning', 'Core machine learning concepts, algorithms, and training mechanics.', 10),
  ('dl', 'Deep Learning', 'Neural network architectures and the mechanics that make them trainable.', 20),
  ('cv', 'Computer Vision', 'How models see: convolution, feature hierarchies, and image understanding.', 30),
  ('nlp', 'NLP', 'Language models, embeddings, and how machines process text.', 40)
on conflict (slug) do update set
  label = excluded.label,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into article_subcategories (slug, category_slug, label, sort_order) values
  ('ml-optimization', 'ml', 'Optimization', 0),
  ('dl-fundamentals', 'dl', 'Fundamentals', 0),
  ('cv-architectures', 'cv', 'Architectures', 0),
  ('nlp-embeddings', 'nlp', 'Embeddings', 0),
  ('nlp-architectures', 'nlp', 'Architectures', 10)
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
    'gradient-descent-intuitively',
    'Gradient Descent, Intuitively',
    'Why almost every model learns by walking downhill: the loss landscape, the role of the learning rate, and how mini-batches change the walk.',
    'published',
    'ml',
    'ml-optimization',
    '2026-09-03T09:00:00Z',
    null,
    null
  ),
  (
    'backpropagation-step-by-step',
    'Backpropagation, Step by Step',
    'How the chain rule turns a network''s forward pass into gradients for every weight, and why the "backward" direction is what makes training tractable.',
    'published',
    'dl',
    'dl-fundamentals',
    '2026-09-03T09:30:00Z',
    null,
    null
  ),
  (
    'convolutional-neural-networks-explained',
    'Convolutional Neural Networks, Explained',
    'How convolution, pooling, and stacked layers let a network build up from edges to full objects with far fewer parameters than a fully-connected net.',
    'published',
    'cv',
    'cv-architectures',
    '2026-09-03T10:00:00Z',
    null,
    null
  ),
  (
    'word-embeddings-and-why-they-work',
    'Word Embeddings and Why They Work',
    'The distributional hypothesis, the skip-gram objective, and why vector arithmetic on words like king minus man plus woman approximates queen.',
    'published',
    'nlp',
    'nlp-embeddings',
    '2026-09-03T10:30:00Z',
    null,
    null
  ),
  (
    'transformers-vs-rnns',
    'Transformers vs. RNNs',
    'Why self-attention replaced recurrence: the parallelism transformers unlock, the quadratic cost they pay for it, and what RNNs got right.',
    'published',
    'nlp',
    'nlp-architectures',
    '2026-09-03T11:00:00Z',
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

delete from article_post_tags where post_slug in (
  'gradient-descent-intuitively',
  'backpropagation-step-by-step',
  'convolutional-neural-networks-explained',
  'word-embeddings-and-why-they-work',
  'transformers-vs-rnns'
);

insert into article_post_tags (post_slug, tag) values
  ('gradient-descent-intuitively', 'machine-learning'),
  ('gradient-descent-intuitively', 'optimization'),
  ('gradient-descent-intuitively', 'beginners'),
  ('backpropagation-step-by-step', 'deep-learning'),
  ('backpropagation-step-by-step', 'neural-networks'),
  ('backpropagation-step-by-step', 'math'),
  ('convolutional-neural-networks-explained', 'computer-vision'),
  ('convolutional-neural-networks-explained', 'cnn'),
  ('convolutional-neural-networks-explained', 'deep-learning'),
  ('word-embeddings-and-why-they-work', 'nlp'),
  ('word-embeddings-and-why-they-work', 'embeddings'),
  ('word-embeddings-and-why-they-work', 'machine-learning'),
  ('transformers-vs-rnns', 'nlp'),
  ('transformers-vs-rnns', 'transformers'),
  ('transformers-vs-rnns', 'rnn')
on conflict (post_slug, tag) do nothing;

insert into article_post_stats (post_slug) values
  ('gradient-descent-intuitively'),
  ('backpropagation-step-by-step'),
  ('convolutional-neural-networks-explained'),
  ('word-embeddings-and-why-they-work'),
  ('transformers-vs-rnns')
on conflict (post_slug) do nothing;
