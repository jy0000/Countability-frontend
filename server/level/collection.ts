import type {HydratedDocument, Types} from 'mongoose';
import type {Level} from './model';
import type {Post} from '../post/model';
import LevelModel from './model';
import UserCollection from '../user/collection';
import PostCollection from '../post/collection';

/**
 * This files contains a class that has the functionality to explore trust
 * stored in MongoDB, including CRUD operations.
 */
class LevelCollection {
  /**
   * Add level of the user (only in user creation).
   *
   * @param {string} currentusername - The id of the current user
   * @return {Promise<HydratedDocument<Level>>} - The new level associated with this user.
   *
   * Operations:
   *  addOne
   *  findOne
   *  updateOne
   *  deleteOne
   */
  static async addOne(
    currentUsername: string
  ): Promise<HydratedDocument<Level>> {
    // Use current amount of posts by this user to determine level
    const allowedPriviledges = new Map<string, boolean>();
    allowedPriviledges.set('canUpvote', false);
    allowedPriviledges.set('canEndorse', false);

    const userLevel = new LevelModel({
      level: 0, // Starts at 0
      username: currentUsername,
      privileges: allowedPriviledges
    });
    await userLevel.save(); // Saves level to MongoDB
    return userLevel.populate(['level', 'username', 'privileges']);
  }

  /**
   * Find current level object
   *
   * @param {string} levelId - The level id
   * @return {Promise<HydratedDocument<Post>> | Promise<null> } - The trust relation between the two users.
   */
  static async findOne(
    levelId: Types.ObjectId | string
  ): Promise<HydratedDocument<Level>> {
    return LevelModel.findOne({_id: levelId});
  }

  static async deleteEverything(
  ): Promise<HydratedDocument<Level>> {
    return LevelModel.remove();
  }

  /**
   * Update user's level
   *
   * @param {Types.ObjectId | string} levelId - The levelId of the user to update
   * @param {string} userPosts - All existing posts of the user, used to determine level.
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async updateOne(levelId: Types.ObjectId | string, userPosts: Post[]): Promise<HydratedDocument<Level>> {
    const userLevel = await LevelModel.findOne({_id: levelId});
    const currentNumPosts = userPosts.length;
    const allowedPriviledges = new Map<string, boolean>();
    allowedPriviledges.set('canUpvote', currentNumPosts >= 1);
    allowedPriviledges.set('canEndorse', currentNumPosts >= 2);

    userLevel.level = currentNumPosts;
    userLevel.privileges = allowedPriviledges;

    await userLevel.save();
    return userLevel;
  }

  /**
   * Delete user's level, called when the user profile is deleted too
   *
   * @param {Types.ObjectId | string} levelId - The user id
   * @return {Promise<boolean>} - The deleted level
   */
  static async deleteOne(levelId: Types.ObjectId | string): Promise<boolean> {
    const userLevel = await LevelModel.deleteOne({_id: levelId});
    return userLevel !== null;
  }
}

export default LevelCollection;
