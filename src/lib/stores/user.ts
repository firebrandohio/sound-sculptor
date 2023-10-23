import { writable } from 'svelte/store';

export const user = writable<any>(null);
export const userBio = writable<string>("");
export const userProfileBio = writable<string>("");

/*// Import necessary database functions and models
import { Database } from '../DatabaseDefinitions'; // Update the import path to the actual file
import { user, userBio, userProfileBio } from './lib/supabase/user'; // Update the import path

// Follow a user
export async function follow(follower: string, following: string) {
  try {
    // Check if both users exist and if 'following' matches the user id in the session
    const followerUser = await Database.getUserById(follower);
    const followingUser = await Database.getUserById(following);

    if (!followerUser || !followingUser) {
      return { err: 'Invalid user IDs' };
    }

    // Check if a record already exists for the relationship
    const existingRelationship = await Database.getRelationship(follower, following);

    if (existingRelationship) {
      return { message: 'User is already following' };
    }

    // Create a new relationship record
    await Database.createRelationship(follower, following);

    return { message: 'User now following' };
  } catch (error) {
    console.error(error);
    return { err: 'Could not add following relationship' };
  }
}

// Unfollow a user
export async function unfollow(follower: string, following: string) {
  try {
    // Check if both users exist and if 'following' matches the user id in the session
    const followerUser = await Database.getUserById(follower);
    const followingUser = await Database.getUserById(following);

    if (!followerUser || !followingUser) {
      return { err: 'Invalid user IDs' };
    }

    // Check if a record exists for the relationship
    const existingRelationship = await Database.getRelationship(follower, following);

    if (!existingRelationship) {
      return { message: 'User is not following' };
    }

    // Remove the relationship record
    await Database.deleteRelationship(existingRelationship.id);

    return { message: 'User unfollowed' };
  } catch (error) {
    console.error(error);
    return { err: 'Could not unfollow' };
  }
}*/


/*
import { Database } from '../DatabaseDefinitions'; // Update the import path
import { user, userBio, userProfileBio } from './lib/supabase/user'; // Update the import path
import { UserProfile, NewPostData } from './lib/components/user/helpers'; // Update the import path

// Follow a user
export async function follow(follower: string, following: string) {
  try {
    // Check if both users exist and validate that 'following' matches the user id in the session.
    const followerUser = await Database.getUserById(follower);
    const followingUser = await Database.getUserById(following);

    if (!followerUser || !followingUser) {
      return { err: 'Invalid user IDs' };
    }

    // Check if a record already exists for the relationship.
    const existingRelationship = await Database.getRelationship(follower, following);

    if (existingRelationship) {
      return { message: 'User is already following' };
    }

    // Create a new relationship record.
    await Database.createRelationship(follower, following);

    return { message: 'User now following' };
  } catch (error) {
    console.error(error);
    return { err: 'Could not add following relationship' };
  }
}

// Unfollow a user
export async function unfollow(follower: string, following: string) {
  try {
    // Check if the session user id equals either user id presented.
    if (follower !== following) {
      return { err: 'Unauthorized: You can only unfollow yourself' };
    }

    // Check if a record exists for the relationship.
    const existingRelationship = await Database.getRelationship(follower, following);

    if (!existingRelationship) {
      return { message: 'User is not following' };
    }

    // Delete the relationship record from the database.
    await Database.deleteRelationship(existingRelationship.id);

    return { message: 'User no longer following' };
  } catch (error) {
    console.error(error);
    return { err: 'Failed to unfollow' };
  }
}

// Get the list of user profiles
export async function getUserList() {
  try {
   

    // Get the profile records of all users.
    const userList = await Database.getAllUserProfiles();

    // Calculate total followers and following for each user.
    for (const user of userList) {
      user.totalFollowers = await Database.getTotalFollowers(user.id);
      user.totalFollowing = await Database.getTotalFollowing(user.id);
      user.spotifyData = await Database.getSpotifyData(user.id);
    }

    return userList;
  } catch (error) {
    console.error(error);
    // Handle HTTP errors
    throw new Error('Failed to retrieve user list');
  }
}

// Create a new post
export async function createPost(data: NewPostData) {
  try {
    // Implement the logic to create a new post using the provided data.
   
    return { message: 'Post created successfully' };
  } catch (error) {
    console.error(error);
    return { err: 'Failed to create the post' };
  }
}
*/
