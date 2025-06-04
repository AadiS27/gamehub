import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
    user:defineTable({
    name:v.string(),
    exp: v.number(),
    level: v.number(),
    avatar: v.optional(v.string()),
    createdAt: v.number(),
}).index("byName", ["name"]).index("byExp", ["exp"]).index("byLevel", ["level"]).searchIndex("searchByName", {
    searchField: "name",
}),
})