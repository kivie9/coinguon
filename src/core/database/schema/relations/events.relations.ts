import { relations } from 'drizzle-orm';
import { events, eventRitualSteps, eventOrganizers } from '../events';
import { clans } from '../clans';

export const eventsRelations = relations(events, ({ one, many }) => ({
    clan: one(clans, {
        fields: [events.clanId],
        references: [clans.id],
    }),
    ritualSteps: many(eventRitualSteps),
    organizers: many(eventOrganizers),
}));

export const eventRitualStepsRelations = relations(eventRitualSteps, ({ one }) => ({
    event: one(events, {
        fields: [eventRitualSteps.eventId],
        references: [events.id],
    }),
}));

export const eventOrganizersRelations = relations(eventOrganizers, ({ one }) => ({
    event: one(events, {
        fields: [eventOrganizers.eventId],
        references: [events.id],
    }),
}));

