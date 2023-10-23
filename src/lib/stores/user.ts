// Import necessary database functions and model
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
}
