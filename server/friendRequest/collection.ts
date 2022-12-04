import type {HydratedDocument, Types} from 'mongoose';
import type {FriendRequest} from './model';
import FriendRequestModel from './model';

/**
 * A class representing CRUD operations on a friend request.
 */
class FriendRequestCollection {
  /** Operations
   *    addOne - Add a friend request made by user A to user B
   *    findOneById - Find a friend request made by user A to user B
   *    findAny - Find any friend request in which user A is involved with (sender or receiver)
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
    senderId: Types.ObjectId | string,
    receiverId: Types.ObjectId | string
  ): Promise<HydratedDocument<FriendRequest>> {
    const dateCreated = new Date();
    const friendRequest = new FriendRequestModel({
      friendRequestSenderId: senderId,
      friendRequestReceiverId: receiverId,
      dateCreated
    });
    await friendRequest.save(); // Saves friend to MongoDB
    return friendRequest.populate('friendRequestReceiverId', 'friendRequestSenderId');
  }

  /**
   * Find a specific friend request made by user A to user B
   *
   * @return {Promise<HydratedDocument<FriendRequest>>} - An array of all friend requests
   */
  static async findOneById(friendRequestId: Types.ObjectId | string): Promise<HydratedDocument<FriendRequest>> {
    return FriendRequestModel.findOne({_id: friendRequestId}).populate(['friendRequestSenderId', 'friendRequestReceiverId']);
  }

  /**
   * Find any existing friend request with the sender or receiver
   *
   * @return {Promise<HydratedDocument<FriendRequest>>} - An array of all friend requests
   */
  static async findAny(senderId: Types.ObjectId | string, receiverId: Types.ObjectId | string): Promise<HydratedDocument<FriendRequest>> {
    return FriendRequestModel.findOne({
      $or: [{
        friendRequestSenderId: senderId, friendRequestReceiverId: receiverId
      }, {
        friendRequestSenderId: receiverId, friendRequestReceiverId: senderId
      }]
    }).populate(['friendRequestSenderId', 'friendRequestReceiverId']);
  }

  /**
   * Find all friend requests in the database, across all users.
   *
   * @return {Promise<HydratedDocument<FriendRequest>[]>} - An array of all friend requests
   */
  static async findAll(): Promise<Array<HydratedDocument<FriendRequest>>> {
    return FriendRequestModel.find({}).sort({dateCreated: -1}).populate(['friendRequestSenderId', 'friendRequestReceiverId']);
  }

  /**
   * Find all outgoing friend requests made by user
   *
   * @param {string} username
   * @return {Promise<HydratedDocument<FriendRequest>[]>} - The friend relation between the two users.
   */
  static async findAllSentByUserId(
    userId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<FriendRequest>>> {
    return FriendRequestModel.find({friendRequestSenderId: userId}).sort({dateCreated: -1}).populate(['friendRequestSenderId', 'friendRequestReceiverId']);
  }

  /**
   * Find all incoming friend requests to user
   *
   * @param {string} username
   * @return {Promise<HydratedDocument<FriendRequest>[]>} - The friend relation between the two users.
   */
  static async findAllReceivedByUserId(
    userId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<FriendRequest>>> {
    return FriendRequestModel.find({friendRequestReceiverId: userId}).sort({dateCreated: -1}).populate(['friendRequestSenderId', 'friendRequestReceiverId']);
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

  /**
   * Clear the database for debugging purpose
   *
   * @return {Promise<FriendRequest>}
   */
  static async deleteEverything(
  ) {
    await FriendRequestModel.deleteMany({});
  }
}

export default FriendRequestCollection;
