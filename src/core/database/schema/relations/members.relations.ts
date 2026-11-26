import { relations } from 'drizzle-orm';
import { members, relationships, memberHonors, memberMedia } from '../members';
import { clans, branches } from '../clans';
import { users } from '../users';

export const membersRelations = relations(members, ({ one, many }) => ({
    clan: one(clans, {
        fields: [members.clanId],
        references: [clans.id],
    }),
    branch: one(branches, {
        fields: [members.branchId],
        references: [branches.id],
    }),
    father: one(members, {
        fields: [members.fatherId],
        references: [members.id],
        relationName: 'fatherChildren',
    }),
    mother: one(members, {
        fields: [members.motherId],
        references: [members.id],
        relationName: 'motherChildren',
    }),
    spouse: one(members, {
        fields: [members.spouseId],
        references: [members.id],
        relationName: 'spousePartner',
    }),
    relationships: many(relationships, { relationName: 'personRelationships' }),
    relatedRelationships: many(relationships, { relationName: 'relatedPersonRelationships' }),
    honors: many(memberHonors),
    media: many(memberMedia),
    user: one(users, {
        fields: [members.id],
        references: [users.memberId],
    }),
}));

export const relationshipsRelations = relations(relationships, ({ one }) => ({
    person: one(members, {
        fields: [relationships.personId],
        references: [members.id],
        relationName: 'personRelationships',
    }),
    relatedPerson: one(members, {
        fields: [relationships.relatedPersonId],
        references: [members.id],
        relationName: 'relatedPersonRelationships',
    }),
}));

export const memberHonorsRelations = relations(memberHonors, ({ one }) => ({
    member: one(members, {
        fields: [memberHonors.memberId],
        references: [members.id],
    }),
}));

export const memberMediaRelations = relations(memberMedia, ({ one }) => ({
    member: one(members, {
        fields: [memberMedia.memberId],
        references: [members.id],
    }),
}));

