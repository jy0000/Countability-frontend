import type {HydratedDocument, Types} from 'mongoose';
import type {Endorse} from '../Endorse/model';
import EndorseModel from './model';
import UserCollection from '../user/collection';
import UserModel from '../user/model';
import FriendCollection from '../friend/collection';

/**
 * This files contains a class that has the functionality to explore endorse
 * stored in MongoDB, including CRUD operations.
 */
class EndorseCollection {
  /**
   * Endorse a post.
   *
   * @param {string} endorserId - The user endorsed user id.
   * @param {string} endorsedPostId - The endorsed post id.
   * @param {string} endorsedPostAuthorId - The endorsed post author id.
   * @return {Promise<HydratedDocument<Friend>>} - The new friend.
   *
   * Operations:
   *  addOne
   *  findOne
   *  updateOne
   *  deleteOne
   */
  static async addOne(
    currentId: Types.ObjectId | string,
    currentPostId: Types.ObjectId | string,
    currentPostAuthorId: Types.ObjectId | string
  ): Promise<HydratedDocument<Endorse>> {
    const date = new Date();
    const friend = new EndorseModel({
      endorserId: currentId,
      endorsedPostId: currentPostId,
      endorsedPostAuthorId: currentPostAuthorId,
      dateEndorsed: date
    });
    await friend.save(); // Saves friend to MongoDB
    return friend.populate(['endorserId', 'endorsedPostId', 'endorsedPostAuthorId', 'dateEndorsed']);
  }

  /**
   * Find current Endorse object
   *
   * @param {string} postId - The Endorse id
   * @return {Promise<HydratedDocument<Post>> | Promise<null> } - The friend relation between the two users.
   */
  static async findOne(
    postId: Types.ObjectId | string,
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<Endorse>> {
    return EndorseModel.findOne({endorsedPostId: postId, endorserId: userId});
  }

  /**
   * Delete user's Endorse, called when the user profile is deleted too
   *
   * @param {Types.ObjectId | string} endorseId - The endorse id
   * @return {Promise<Boolean>} - The deleted Endorse
   */
  static async deleteOne(
    postId: Types.ObjectId | string,
    userId: Types.ObjectId | string): Promise<boolean> {
    const userEndorse = await EndorseModel.deleteOne({endorsedPostId: postId, endorserId: userId});
    return userEndorse !== null;
  }

  /**
   * Find all posts endorsed by username.
   *
   * @param {string} username - The username of author of the posts
   * @return {Promise<HydratedDocument<Post>[]>} - An array of all of the posts
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Endorse>>> {
    const author = await UserCollection.findOneByUsername(username);
    return EndorseModel.find({endorserId: author._id}).populate('endorserId');
  }

  /**
   * Find all posts endorsed by username.
   * @param {string} userId - The user who is trying to view all endorsed posts from their friended useers.
   * @return {Promise<HydratedDocument<Post>[]>} - An array of all of the posts
   */
  static async findAllByFriendedUsers(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Endorse>>> {
    const friendedUsers = await FriendCollection.findAllFriendGivenById(userId);
    const allFriendedUserIds = friendedUsers.map(friend => friend.friendReceiverId._id);
    const endorsementsFromFriended = await EndorseModel.find({endorserId: {$in: allFriendedUserIds}}).populate('endorserId');
    return endorsementsFromFriended;
  }
}

export default EndorseCollection;
