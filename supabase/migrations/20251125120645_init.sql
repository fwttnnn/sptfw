-- user hovered the x axis
CREATE TABLE IF NOT EXISTS hover__axis (
  uid text PRIMARY KEY NOT NULL, -- user id
  cat timestamptz DEFAULT now()  -- created at
);

-- user hovered a specific album
CREATE TABLE IF NOT EXISTS hover__album (
  uid text NOT NULL,             -- user id
  aid text NOT NULL,             -- album id
  cat timestamptz DEFAULT now(), -- created at
  PRIMARY KEY (uid, aid)
);

-- allow anyone to insert into hover__axis
CREATE POLICY "insert hover__axis"
ON public.hover__axis
FOR INSERT
USING (true);

-- allow anyone to insert into hover__album
CREATE POLICY "insert hover__album"
ON public.hover__album
FOR INSERT
USING (true);
