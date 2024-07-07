// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { table } from "console";
import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `spot-the-vinyl_${name}`);

export const artists = createTable(
  "artist",
  {
    id: varchar("id", { length: 256 }).primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    image: varchar("image", { length: 1024 }),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const user_artists = createTable(
  "user_artists",
  {
    artist_id: varchar("artist_id", { length: 256 })
      .notNull()
      .references(() => artists.id),
    user_id: varchar("user_id", { length: 256 }).notNull(),
    assigned: timestamp("assigned", { precision: 3 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.artist_id, table.user_id] }),
  }),
);
