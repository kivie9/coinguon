import {
    sqliteTable,
    text,
    integer,
    index,
} from 'drizzle-orm/sqlite-core';
import { clans } from './clans';

/**
 * Bảng Sự kiện dòng họ & Đại lễ kỵ nhật (events) - SQLite / Cloudflare D1
 */
export const events = sqliteTable(
    'events',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        clanId: integer('clan_id').references(() => clans.id, { onDelete: 'cascade' }),
        title: text('title').notNull(),
        category: text('category').notNull(), // 'ANNIVERSARY' | 'FESTIVAL' | 'EDUCATION' | 'MEETING'
        eventDateSolar: text('event_date_solar').notNull(), // ISO YYYY-MM-DD
        eventDateLunar: text('event_date_lunar'),
        timeStart: text('time_start'),
        location: text('location').notNull(),
        roleAudience: text('role_audience'),
        description: text('description'),
        status: text('status').default('UPCOMING').notNull(),
        isFeatured: integer('is_featured', { mode: 'boolean' }).default(false).notNull(),
        createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
        updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    },
    (table) => [
        index('idx_events_solar_date').on(table.eventDateSolar),
        index('idx_events_category').on(table.category),
    ]
);

/**
 * Bảng Các bước nghi thức tế lễ (event_ritual_steps)
 */
export const eventRitualSteps = sqliteTable(
    'event_ritual_steps',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        eventId: integer('event_id')
            .notNull()
            .references(() => events.id, { onDelete: 'cascade' }),
        stepNumber: integer('step_number').notNull(),
        timeScheduled: text('time_scheduled').notNull(),
        title: text('title').notNull(),
        description: text('description').notNull(),
    },
    (table) => [
        index('idx_event_ritual_steps_event_id').on(table.eventId),
    ]
);

/**
 * Bảng Ban tổ chức / Ban liên lạc sự kiện (event_organizers)
 */
export const eventOrganizers = sqliteTable(
    'event_organizers',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        eventId: integer('event_id')
            .notNull()
            .references(() => events.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        role: text('role').notNull(),
        phone: text('phone'),
    },
    (table) => [
        index('idx_event_organizers_event_id').on(table.eventId),
    ]
);

export type EventItem = typeof events.$inferSelect;
export type NewEventItem = typeof events.$inferInsert;

export type EventRitualStepItem = typeof eventRitualSteps.$inferSelect;
export type NewEventRitualStepItem = typeof eventRitualSteps.$inferInsert;

export type EventOrganizerItem = typeof eventOrganizers.$inferSelect;
export type NewEventOrganizerItem = typeof eventOrganizers.$inferInsert;
