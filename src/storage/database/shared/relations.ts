import { relations } from "drizzle-orm/relations";
import { appUsers, accessLogs } from "./schema";

export const accessLogsRelations = relations(accessLogs, ({ one }) => ({
  user: one(appUsers, {
    fields: [accessLogs.user_id],
    references: [appUsers.id],
  }),
}));
