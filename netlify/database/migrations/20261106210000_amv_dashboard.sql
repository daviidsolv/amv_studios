CREATE TABLE amv_content (
  id smallint PRIMARY KEY CHECK (id = 1),
  document jsonb CHECK (document IS NULL OR jsonb_typeof(document) = 'object'),
  revision integer NOT NULL DEFAULT 0 CHECK (revision >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO amv_content (id) VALUES (1);

CREATE TABLE amv_media (
  id uuid PRIMARY KEY,
  filename text NOT NULL CHECK (char_length(filename) BETWEEN 1 AND 240),
  alt text NOT NULL CHECK (char_length(alt) BETWEEN 1 AND 300),
  width integer NOT NULL CHECK (width > 0),
  height integer NOT NULL CHECK (height > 0),
  bytes integer NOT NULL CHECK (bytes > 0),
  store_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz
);
CREATE INDEX amv_media_active_created ON amv_media (created_at DESC) WHERE archived_at IS NULL;

CREATE TABLE amv_login_limits (
  id text PRIMARY KEY,
  started_at timestamptz NOT NULL DEFAULT now(),
  attempts integer NOT NULL DEFAULT 1 CHECK (attempts >= 0)
);
