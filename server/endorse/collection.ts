import type {HydratedDocument, Types} from 'mongoose';
import type {Endorse} from '../Endorse/model';
import EndorseModel from './model';
import UserCollection from '../user/collection';
import UserModel from '../user/model';
import TrustCollection from '../trust/collection';

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
   * @return {Promise<HydratedDocument<Trust>>} - The new trust.
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
    const trust = new EndorseModel({
      endorserId: currentId,
      endorsedPostId: currentPostId,
      endorsedPostAuthorId: currentPostAuthorId,
      dateEndorsed: date
    });
    await trust.save(); // Saves trust to MongoDB
    return trust.populate(['endorserId', 'endorsedPostId', 'endorsedPostAuthorId', 'dateEndorsed']);
  }

  /**
   * Find current Endorse object
   *
   * @param {string} postId - The Endorse id
   * @return {Promise<HydratedDocument<Post>> | Promise<null> } - The trust relation between the two users.
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
   * @param {string} userId - The user who is trying to view all endorsed posts from their trusted useers.
   * @return {Promise<HydratedDocument<Post>[]>} - An array of all of the posts
   */
  static async findAllByTrustedUsers(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Endorse>>> {
    const trustedUsers = await TrustCollection.findAllTrustGivenById(userId);
    const allTrustedUserIds = trustedUsers.map(trust => trust.trustReceiverId._id);
    const endorsementsFromTrusted = await EndorseModel.find({endorserId: {$in: allTrustedUserIds}}).populate('endorserId');
    return endorsementsFromTrusted;
  }
}

export default EndorseCollection;
