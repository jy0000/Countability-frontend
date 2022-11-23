import type {HydratedDocument, Types} from 'mongoose';
import type {Friend} from './model';
import FriendModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore friend
 * stored in MongoDB, including CRUD operations.
 */
class FriendCollection {
  /**
   * Friend a user
   *
   * @param {string} giverId - The user who is enfriending another user.
   * @param {string} receiverId - The user receiving the friend.
   * @return {Promise<HydratedDocument<Friend>>} - The new friend.
   *
   * Operations:
   *    addOne  (done)
   *    findOne (done)
   *    findAll - returns all friend relationships (done)
   *    unfriendOneById (done)
   *    unfriendAllById (done)
   *    findAllFriendGivenById (done)
   *    findAllFriendReceivedById (done)
   */
  static async addOne(
    giverId: Types.ObjectId | string,
    receiverId: Types.ObjectId | string
  ): Promise<HydratedDocument<Friend>> {
    const date = new Date();
    const friend = new FriendModel({
      friendGiverId: giverId,
      friendReceiverId: receiverId,
      dateFriended: date
    });
    await friend.save(); // Saves friend to MongoDB
    return friend.populate(['friendGiverId', 'friendReceiverId']);
  }

  /**
   * Find a friend using giverId and receiverId
   *
   * @param {string} giverId - The id of the friend giver
   * @param {string} receiverId - The id of the friend receiver
   * @return {Promise<HydratedDocument<Post>> | Promise<null> } - The friend relation between the two users.
   */
  static async findOne(
    giverId: Types.ObjectId | string,
    receiverId: Types.ObjectId | string
  ): Promise<HydratedDocument<Friend>> {
    return FriendModel.findOne({friendGiverId: giverId, friendReceiverId: receiverId});
  }

  /**
   * Fetch all friend relationships in the database.
   *
   * @return {Promise<HydratedDocument<Friend>[]>} - An array of all of friends
   */
  static async deleteEverything(): Promise<Array<HydratedDocument<Friend>>> {
    return FriendModel.remove();
  }

  /**
   * Fetch all friend relationships in the database.
   *
   * @return {Promise<HydratedDocument<Friend>[]>} - An array of all of friends
   */
  static async findAll(): Promise<Array<HydratedDocument<Friend>>> {
    return FriendModel.find({}).sort({dateFriended: -1});
  }

  /**
   * Unfriend a user
   *
   * @param {string} giverId
   * @param {string} receiverId
   * @return {Promise<HydratedDocument<User>> | Promise<null>}
   */

  static async unfriendOneById(giverId: Types.ObjectId | string, receiverId: Types.ObjectId | string): Promise<boolean> {
    const unfriend = await FriendModel.deleteOne({friendGiverId: giverId, friendReceiverId: receiverId});
    return unfriend !== null;
  }

  /**
   * Delete all friend associating the user (either the user giving friend or receiving friend)
   *
   * @param {string} userId the user who is unfriending all users they friended.
   * @return {Promise<Boolean>} True if the user has unfriended everyone, false otherwise
   */
  static async unfriendAllById(userId: Types.ObjectId | string): Promise<void> {
    await FriendModel.deleteMany({friendGiverId: userId}); // Multiply entires deletion
    await FriendModel.deleteMany({friendReceiverId: userId}); // Multiply entires deletion
  }

  /**
   * Get a list of all other users this user enfriend.
   *
   * @param {string} userId - The ID of the user
   * @return {Promise<HydratedDocument<User>[]>} - An array of all users this user friends.
   */
  static async findAllFriendGivenById(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Friend>>> {
    return FriendModel.find({friendGiverId: userId}).populate(['friendGiverId', 'friendReceiverId']);
  }

  /**
   * Get a list of all other users that friend this user.
   *
   * @param {string} userId - The ID of the user
   * @return {Promise<HydratedDocument<User>[]>} - An array of all of the users friending this user.
   */
  static async findAllFriendReceivedById(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Friend>>> {
    return FriendModel.find({friendReceiverId: userId}).populate(['friendGiverId', 'friendReceiverId']);
  }
}

export default FriendCollection;
