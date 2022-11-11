import type {HydratedDocument, Types} from 'mongoose';
import type {Trust} from './model';
import TrustModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore trust
 * stored in MongoDB, including CRUD operations.
 */
class TrustCollection {
  /**
   * Trust a user
   *
   * @param {string} giverId - The user who is entrusting another user.
   * @param {string} receiverId - The user receiving the trust.
   * @return {Promise<HydratedDocument<Trust>>} - The new trust.
   *
   * Operations:
   *    addOne  (done)
   *    findOne (done)
   *    findAll - returns all trust relationships (done)
   *    untrustOneById (done)
   *    untrustAllById (done)
   *    findAllTrustGivenById (done)
   *    findAllTrustReceivedById (done)
   */
  static async addOne(
    giverId: Types.ObjectId | string,
    receiverId: Types.ObjectId | string
  ): Promise<HydratedDocument<Trust>> {
    const date = new Date();
    const trust = new TrustModel({
      trustGiverId: giverId,
      trustReceiverId: receiverId,
      dateTrusted: date
    });
    await trust.save(); // Saves trust to MongoDB
    return trust.populate(['trustGiverId', 'trustReceiverId']);
  }

  /**
   * Find a trust using giverId and receiverId
   *
   * @param {string} giverId - The id of the trust giver
   * @param {string} receiverId - The id of the trust receiver
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The trust relation between the two users.
   */
  static async findOne(
    giverId: Types.ObjectId | string,
    receiverId: Types.ObjectId | string
  ): Promise<HydratedDocument<Trust>> {
    return TrustModel.findOne({trustGiverId: giverId, trustReceiverId: receiverId});
  }

  /**
   * Fetch all trust relationships in the database.
   *
   * @return {Promise<HydratedDocument<Trust>[]>} - An array of all of trusts
   */
  static async deleteEverything(): Promise<Array<HydratedDocument<Trust>>> {
    return TrustModel.remove();
  }

  /**
   * Fetch all trust relationships in the database.
   *
   * @return {Promise<HydratedDocument<Trust>[]>} - An array of all of trusts
   */
  static async findAll(): Promise<Array<HydratedDocument<Trust>>> {
    return TrustModel.find({}).sort({dateTrusted: -1});
  }

  /**
   * Untrust a user
   *
   * @param {string} giverId
   * @param {string} receiverId
   * @return {Promise<HydratedDocument<User>> | Promise<null>}
   */

  static async untrustOneById(giverId: Types.ObjectId | string, receiverId: Types.ObjectId | string): Promise<boolean> {
    const untrust = await TrustModel.deleteOne({trustGiverId: giverId, trustReceiverId: receiverId});
    return untrust !== null;
  }

  /**
   * Delete all trust associating the user (either the user giving trust or receiving trust)
   *
   * @param {string} userId the user who is untrusting all users they trusted.
   * @return {Promise<Boolean>} True if the user has untrusted everyone, false otherwise
   */
  static async untrustAllById(userId: Types.ObjectId | string): Promise<void> {
    await TrustModel.deleteMany({trustGiverId: userId}); // Multiply entires deletion
    await TrustModel.deleteMany({trustReceiverId: userId}); // Multiply entires deletion
  }

  /**
   * Get a list of all other users this user entrust.
   *
   * @param {string} userId - The ID of the user
   * @return {Promise<HydratedDocument<User>[]>} - An array of all users this user trusts.
   */
  static async findAllTrustGivenById(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Trust>>> {
    return TrustModel.find({trustGiverId: userId}).populate(['trustGiverId', 'trustReceiverId']);
  }

  /**
   * Get a list of all other users that trust this user.
   *
   * @param {string} userId - The ID of the user
   * @return {Promise<HydratedDocument<User>[]>} - An array of all of the users trusting this user.
   */
  static async findAllTrustReceivedById(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Trust>>> {
    return TrustModel.find({trustReceiverId: userId}).populate(['trustGiverId', 'trustReceiverId']);
  }
}

export default TrustCollection;
