
import {mutation, query} from "./_generated/server";

import { v } from "convex/values";

export const update = mutation({
  args: { name: v.string(), exp: v.number(), level: v.number(), avatar: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Use withIndex instead of filter for better performance
    const user = await ctx.db.query("user")
      .withIndex("byName", q => q.eq("name", args.name))
      .first();
      
    if (user) {
      await ctx.db.patch(user._id, {
        exp: args.exp,
        level: args.level,
        avatar: args.avatar,
      });
      return user._id;
    } else {
      // Create new user
      return await ctx.db.insert("user", {
        name: args.name,
        exp: args.exp,
        level: args.level,
        avatar: args.avatar,
        createdAt: Date.now(),
      });
    }
  },
});

export const getCurrentIdentity = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    return {
      name: identity.name || identity.nickname || identity.email || identity.subject,
      pictureUrl: identity.pictureUrl
    };
  }
});


    // Add your user-related functions here
export const getLeaderboard = query({
  args: { timeFrame: v.union(v.literal("daily"), v.literal("weekly"), v.literal("allTime")) },
  handler: async (ctx, { timeFrame }) => {
    // Query users based on timeFrame
    let users;
    
    if (timeFrame === "daily") {
      // For daily, filter by recent activity
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      users = await ctx.db.query("user")
        .filter(q => q.gte(q.field("createdAt"), oneDayAgo))
        .collect();
    } else if (timeFrame === "weekly") {
      // For weekly, filter by last 7 days
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      users = await ctx.db.query("user")
        .filter(q => q.gte(q.field("createdAt"), oneWeekAgo))
        .collect();
    } else {
      // All time - get all users
      users = await ctx.db.query("user").collect();
    }
    
    console.log("Retrieved users:", users); // Add logging
    
    // Sort users by experience points (descending)
    users.sort((a, b) => b.exp - a.exp);
    
    // Map to the format expected by the frontend
    const mappedUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      imageUrl: user.avatar,
      score: user.exp || 0, // Ensure we have a default value if exp is undefined
      level: user.level || 1,
      previousRank: undefined,
      streak: undefined
    }));
    
    console.log("Mapped users for leaderboard:", mappedUsers); // Add logging
    
    return mappedUsers;
  },
});
export const create = mutation({
    args: { name: v.string(), exp: v.number(), level: v.number(), avatar: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("user")
          .withIndex("byName", q => q.eq("name", args.name))
          .first();
        
        if (user) {
            // Return the existing user instead of throwing an error
            return user._id;
        }
        
        return await ctx.db.insert("user", {
            name: args.name,
            exp: args.exp,
            level: args.level,
            avatar: args.avatar,
            createdAt: Date.now(),
        });
    },
});

export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Special case for "currentUser" - get the currently authenticated user
    if (userId === "currentUser") {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }
      
      // Get identifier from the identity object
      const userName = identity.name || identity.nickname || identity.email || identity.subject;
      
      // Look up user by their identity
      const user = await ctx.db.query("user")
        .withIndex("byName", q => q.eq("name", userName))
        .first();
        
      if (!user) {
        // Instead of throwing an error, we should handle this more gracefully
        return {
          id: "not_found",
          name: userName,
          exp: 0,
          level: 1,
          avatar: identity.pictureUrl,
          needsCreation: true
        };
      }
      
      return {
        id: user._id,
        name: user.name,
        exp: user.exp,
        level: user.level,
        avatar: user.avatar,
      };
    }
    
    // Missing code for the non-currentUser case:
    // Get a user by their ID
    try {
      const id = ctx.db.normalizeId("user", userId);
      if (!id) {
        throw new Error("Invalid user ID");
      }
      
      const user = await ctx.db.get(id);
      if (!user) {
        throw new Error("User not found");
      }
      
      return {
        id: user._id,
        name: user.name,
        exp: user.exp,
        level: user.level,
        avatar: user.avatar,
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },
});