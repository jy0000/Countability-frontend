import type {HydratedDocument, Types} from 'mongoose';
import type {Friendship} from './model';
import FriendshipModel from './model';

/**
 * A class representing CRUD operations on a friendship.
 */
class FriendshipCollection {
  /** Operations
   *    addOne - Establish a friendship (after two users confirm their intent to befriend each other)
   *    findOneById - Find a friendship by ID
   *    findAll - Find all friendships in the database
   *    findAny - Find any existing friendship given two users, used to check existing friendships
   *    findAllFriendshipsOfUser - Find all friendships of a user (by username)
   *    deleteOne - Delete a friendship between two users (by friendship ID)
   *    deleteAllFriendshipOfUser - Delete all friendships where user is involved; used when deleting the user account
   */

  /**
   * Establish a friendship (after two users confirm their intent to befriend each other)
   *
   * @param {Types.ObjectId | string} userOneId - The first user in this friendship relationship
   * @param {Types.ObjectId | string} userTwoId - The other user in this friendship relationship
   * @return {Promise<HydratedDocument<Friendship>>} - The new friendship
   */
  static async addOne(
    userOneId: Types.ObjectId | string,
    userTwoId: Types.ObjectId | string
  ): Promise<HydratedDocument<Friendship>> {
    const dateCreated = new Date();
    const friendship = new FriendshipModel({
      userOneId,
      userTwoId,
      dateCreated
    });
    await friendship.save();
    return friendship.populate(['userOneId', 'userTwoId']);
  }

  /**
   * Find a friendship by its id
   *
   * @param {Types.ObjectId | string} friendshipId
   * @return {Promise<HydratedDocument<Post>> | Promise<null> } - The friend relation between the two users.
   */
  static async findOne(
    friendshipId: Types.ObjectId | string
  ): Promise<HydratedDocument<Friendship>> {
    return FriendshipModel.findOne({_id: friendshipId});
  }

  /**
   * Find all friendships in the database
   *
   * @return {Promise<HydratedDocument<Friendship>[]>} - An array of all of friends
   */
  static async findAll(): Promise<Array<HydratedDocument<Friendship>>> {
    return FriendshipModel.find({}).sort({dateFriendshiped: -1}).populate(['userOneId', 'userTwoId']);
  }

  /**
   * Find all friendships where this user is involved (can be none)
   *
   * @param {Types.ObjectId | string} currentUserId
   * @return {Promise<HydratedDocument<Friendship>[]> | Promise<null>}
   */
  static async findAllFriendshipsOfUser(currentUserId: Types.ObjectId | string): Promise<Array<HydratedDocument<Friendship>>> {
    const friendships = await FriendshipModel.find({
      $or: [{
        userOneId: currentUserId
      }, {
        userTwoId: currentUserId
      }]
    }).populate(['userOneId', 'userTwoId']);
    return friendships;
  }

  /**
   * Find any existing friendship with user A and user B
   *
   * @param {Types.ObjectId | string} currentUserId
   * @return {Promise<HydratedDocument<Friendship>[]> | Promise<null>}
   */
  static async findAny(IdOne: Types.ObjectId | string, IdTwo: Types.ObjectId | string): Promise<Array<HydratedDocument<Friendship>>> {
    return FriendshipModel.findOne({
      $or: [{
        userOneId: IdOne, userTwoId: IdTwo
      }, {
        userOneId: IdTwo, userTwoId: IdOne
      }]
    }).populate(['userOneId', 'userTwoId']); // Tricky bug: find returns a cursor instead of null
  }

  /**
   * Delete one friend request by id.
   *
   * @param {Types.ObjectId | string} friendshipId
   * @return {Promise<HydratedDocument<Friendship>[]>} - The friend relation between the two users.
   */
  static async deleteOne(
    friendshipId: Types.ObjectId | string
  ): Promise<boolean> {
    const deletedFriendRequest = await FriendshipModel.deleteOne({_id: friendshipId});
    return deletedFriendRequest !== null;
  }

  /**
  * Delete all friendships where user is involved
  *
  * @param {Types.ObjectId | string} userId
  * @return {Promise<void>}
  */
  static async deleteAllFriendshipOfUser(
    userId: Types.ObjectId | string
  ): Promise<void> {
    // This redundancy should be ok because of the unique nature of a friendship
    await FriendshipModel.deleteMany({userOneId: userId});
    await FriendshipModel.deleteMany({userTwoId: userId});
  }

  /**
   * Clear the database for debugging purpose
   *
   * @return
   */
  static async deleteEverything(
  ) {
    await FriendshipModel.deleteMany({});
  }
}

export default FriendshipCollection;
