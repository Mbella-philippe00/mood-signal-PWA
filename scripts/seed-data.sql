-- Seed data for Mood Signal
-- Sample suggested replies for each mood

INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
('😊', ARRAY[
  'I''m so happy to hear that! What made your day special?',
  'That''s wonderful! Keep shining!',
  'Your happiness makes my day brighter too',
  'Tell me everything! I want to celebrate with you'
]);

INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
('😢', ARRAY[
  'I wish I could be there with you. What happened?',
  'I''m here for you, always. Lean on me',
  'It''s okay to feel sad sometimes. I''m listening.',
  'How can I support you right now?'
]);

INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
('😴', ARRAY[
  'Get some rest, I''ll be here when you wake up',
  'Sleep tight, sleep well!',
  'You deserve a good rest. Take care of yourself!',
  'Sweet dreams, I''m thinking of you'
]);

INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
('😡', ARRAY[
  'What''s going on? I''m here to listen.',
  'Take your time. We can talk about it whenever you''re ready.',
  'I understand you''re upset. How can I help?',
  'I''m here for you, no matter what'
]);

INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
('😍', ARRAY[
  'I love you so much',
  'You make me feel the same way!',
  'Sending all my love your way',
  'I can''t wait to see you again'
]);

INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
('😕', ARRAY[
  'Something on your mind? I''m all ears.',
  'Talk to me, what''s confusing you?',
  'We''ll figure this out together.',
  'Tell me what you need'
]);

INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
('😰', ARRAY[
  'What''s worrying you? Let me know how I can help.',
  'Take a deep breath, I''m right here with you.',
  'You''re not alone in this. We''ll get through it.',
  'I''m here to support you through this'
]);

INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
('😐', ARRAY[
  'Everything okay? Want to talk about it?',
  'I''m here if you need anything.',
  'How can I brighten your day?',
  'Whatever''s on your mind, I''m listening'
]);
