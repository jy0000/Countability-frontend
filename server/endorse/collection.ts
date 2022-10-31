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
   * Endorse a freet.
   *
   * @param {string} endorserId - The user endorsed user id.
   * @param {string} endorsedFreetId - The endorsed freet id.
   * @param {string} endorsedFreetAuthorId - The endorsed freet author id.
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
    currentFreetId: Types.ObjectId | string,
    currentFreetAuthorId: Types.ObjectId | string
  ): Promise<HydratedDocument<Endorse>> {
    const date = new Date();
    const trust = new EndorseModel({
      endorserId: currentId,
      endorsedFreetId: currentFreetId,
      endorsedFreetAuthorId: currentFreetAuthorId,
      dateEndorsed: date
    });
    await trust.save(); // Saves trust to MongoDB
    return trust.populate(['endorserId', 'endorsedFreetId', 'endorsedFreetAuthorId', 'dateEndorsed']);
  }

  /**
   * Find current Endorse object
   *
   * @param {string} freetId - The Endorse id
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The trust relation between the two users.
   */
  static async findOne(
    freetId: Types.ObjectId | string,
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<Endorse>> {
    return EndorseModel.findOne({endorsedFreetId: freetId, endorserId: userId});
  }

  /**
   * Delete user's Endorse, called when the user profile is deleted too
   *
   * @param {Types.ObjectId | string} endorseId - The endorse id
   * @return {Promise<Boolean>} - The deleted Endorse
   */
  static async deleteOne(
    freetId: Types.ObjectId | string,
    userId: Types.ObjectId | string): Promise<boolean> {
    const userEndorse = await EndorseModel.deleteOne({endorsedFreetId: freetId, endorserId: userId});
    return userEndorse !== null;
  }

  /**
   * Find all freets endorsed by username.
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Endorse>>> {
    const author = await UserCollection.findOneByUsername(username);
    return EndorseModel.find({endorserId: author._id}).populate('endorserId');
  }

  /**
   * Find all freets endorsed by username.
   * @param {string} userId - The user who is trying to view all endorsed posts from their trusted useers.
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByTrustedUsers(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Endorse>>> {
    const trustedUsers = await TrustCollection.findAllTrustGivenById(userId);
    const allTrustedUserIds = trustedUsers.map(trust => trust.trustReceiverId._id);
    const endorsementsFromTrusted = await EndorseModel.find({endorserId: {$in: allTrustedUserIds}}).populate('endorserId');
    return endorsementsFromTrusted;
  }
}

export default EndorseCollection;
