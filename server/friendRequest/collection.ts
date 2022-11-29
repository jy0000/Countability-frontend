import type {HydratedDocument, Types} from 'mongoose';
import type {FriendRequest} from './model';
import FriendRequestModel from './model';
import UserCollection from '../user/collection';

/**
 * A class representing CRUD operations on a friend request.
 */
class FriendRequestCollection {
  /** Operations
   *    addOne - Add a friend request made by user A to user B
   *    findOne - Find a friend request made by user A to user B
   *    findAll - Find all friend requests in the database
   *    findAllSentByUserId - Find all requests sent by the user of username 'username'
   *    findAllReceivedByUserId - Find all requests received by the user of username 'username'
   *    deleteOne - Delete a friend request by id
   *    deleteAllRequestsOfUser - Delete all requests sent by or received by a specific user; used when deleting the user account
   */

  /**
   * Create a friend request.
   *
   * @param {string} friendRequestSenderId - The user id representing the user who sends the friend request
   * @param {string} friendRequestReceiverId - The user id representing the user who receives the friend request
   * @return {Promise<HydratedDocument<FriendRequest>>} - The created friend request.
   *
   * Operations:
   */
  static async addOne(
    friendRequestSenderId: Types.ObjectId | string,
    friendRequestReceiverId: Types.ObjectId | string
  ): Promise<HydratedDocument<FriendRequest>> {
    const dateCreated = new Date();
    const friendRequest = new FriendRequestModel({
      friendRequestSenderId,
      friendRequestReceiverId,
      dateCreated
    });
    await friendRequest.save(); // Saves friend to MongoDB
    return friendRequest.populate(['friendRequestSenderId', 'friendRequestReceiverId']);
  }

  /**
   * Find a specific friend request made by user A to user B
   *
   * @return {Promise<HydratedDocument<FriendRequest>>} - An array of all friend requests
   */
  static async findOne(senderName: string, receiverName: string): Promise<HydratedDocument<FriendRequest>> {
    const sender = await UserCollection.findOneByUsername(senderName);
    const receiver = await UserCollection.findOneByUsername(receiverName);
    return FriendRequestModel.findOne({friendRequestSenderId: sender._id, friendRequestReceiverId: receiver._id}).sort({dateCreated: -1}).populate('dateCreated');
  }

  /**
   * Find all friend requests in the database, across all users.
   *
   * @return {Promise<HydratedDocument<FriendRequest>[]>} - An array of all friend requests
   */
  static async findAll(): Promise<Array<HydratedDocument<FriendRequest>>> {
    return FriendRequestModel.find({}).sort({dateCreated: -1}).populate('friendRequestSenderId');
  }

  /**
   * Find all friend requests made by a specific user name
   *
   * @param {string} username
   * @return {Promise<HydratedDocument<FriendRequest>[]>} - The friend relation between the two users.
   */
  static async findAllSentByUserId(
    userId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<FriendRequest>>> {
    return FriendRequestModel.find({friendRequestSenderId: userId}).sort({dateCreated: -1}).populate('friendRequestSenderId');
  }

  /**
   * Find all friend requests made by a specific user name
   *
   * @param {string} username
   * @return {Promise<HydratedDocument<FriendRequest>[]>} - The friend relation between the two users.
   */
  static async findAllReceivedByUserId(
    userId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<FriendRequest>>> {
    return FriendRequestModel.find({friendRequestReceiverId: userId}).sort({dateCreated: -1}).populate('friendRequestSenderId');
  }

  /**
   * Delete one friend request by id.
   *
   * @param {string} username
   * @return {Promise<HydratedDocument<FriendRequest>[]>} - The friend relation between the two users.
   */
  static async deleteOne(
    friendRequestId: Types.ObjectId | string
  ): Promise<boolean> {
    const deletedFriendRequest = await FriendRequestModel.deleteOne({_id: friendRequestId});
    return deletedFriendRequest !== null;
  }

  /**
   * Find all friend requests made by or received by a specific user
   *
   * @param {string} username
   * @return {Promise<HydratedDocument<FriendRequest>[]>} - The friend relation between the two users.
   */
  static async deleteAllRequestsOfUser(
    userId: Types.ObjectId | string
  ): Promise<boolean> {
    const deleteRequestsSentByUser = await FriendRequestModel.deleteMany({friendRequestSenderId: userId});
    const deleteRequestsReceivedByUser = await FriendRequestModel.deleteMany({friendRequestReceiverId: userId});
    return (deleteRequestsSentByUser !== null || deleteRequestsReceivedByUser !== null);
  }
}

export default FriendRequestCollection;
