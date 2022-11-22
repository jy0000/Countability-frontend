import type {HydratedDocument, Types} from 'mongoose';
import type {Session} from './model';
import SessionModel from './model';
import UserCollection from '../user/collection';
import FriendCollection from '../friend/collection';

/**
 * This files contains a class that has the functionality to explore sessions
 * stored in MongoDB, including adding, finding, updating, and deleting sessions.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Session> is the output of the SessionModel() constructor,
 * and contains all the information in Session. https://mongoosejs.com/docs/typescript.html
 */
class SessionCollection {
  /**
   * Add a session to the collection
   *
   * @param {string} authorId - The id of the author of the session
   * @param {string} content - The id of the content of the session
   * @return {Promise<HydratedDocument<Session>>} - The newly created session
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    content: string,
    sessionType: string,
    sourceLink: string,
    emoji: string
  ): Promise<HydratedDocument<Session>> {
    const date = new Date();
    const session = new SessionModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date,
      sessionType,
      sourceLink,
      emoji
    });
    await session.save(); // Saves session to MongoDB
    return session.populate('authorId');
  }

  /**
   * Find a session by sessionId
   *
   * @param {string} sessionId - The id of the session to find
   * @return {Promise<HydratedDocument<Session>> | Promise<null> } - The session with the given sessionId, if any
   */
  static async findOne(sessionId: Types.ObjectId | string): Promise<HydratedDocument<Session>> {
    return SessionModel.findOne({_id: sessionId}).populate('authorId');
  }

  /**
   * Get all the sessions in the database
   *
   * @return {Promise<HydratedDocument<Session>[]>} - An array of all of the sessions
   */
  static async findAll(): Promise<Array<HydratedDocument<Session>>> {
    // Retrieves sessions and sorts them from most to least recent
    return SessionModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the sessions in by given author
   *
   * @param {string} username - The username of author of the sessions
   * @return {Promise<HydratedDocument<Session>[]>} - An array of all of the sessions
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Session>>> {
    const author = await UserCollection.findOneByUsername(username);
    return SessionModel.find({authorId: author._id}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the sessions in by given type
   *
   * @param {string} targetSessionType - The session type desired.
   * @return {Promise<HydratedDocument<Session>[]>} - An array of all of the sessions
   */
  static async findAllBySessionType(targetSessionType: string): Promise<Array<HydratedDocument<Session>>> {
    return SessionModel.find({sessionType: targetSessionType}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the sessions in by given type
   *
   * @param {string} currentUserId - The current user Id
   * @return {Promise<HydratedDocument<Session>[]>} - An array of all of the sessions
   */
  static async findAllByFriendedUsers(currentUserId: string): Promise<Array<HydratedDocument<Session>>> {
    const allFriends = await FriendCollection.findAllFriendGivenById(currentUserId);
    const allFriendedUserIds = allFriends.map(friend => friend.friendReceiverId._id);
    const sessionsFromFriendedUsers = await SessionModel.find({authorId: {$in: allFriendedUserIds}}).sort({dateModified: -1}).populate('authorId');
    return sessionsFromFriendedUsers;
  }

  /**
   * Update a session with the new content
   *
   * @param {string} sessionId - The id of the session to be updated
   * @param {string} content - The new content of the session
   * @return {Promise<HydratedDocument<Session>>} - The newly updated session
   */
  static async updateOne(sessionId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Session>> {
    const session = await SessionModel.findOne({_id: sessionId});
    session.content = content;
    session.dateModified = new Date();
    await session.save();
    return session.populate('authorId');
  }

  /**
   * Delete a session with given sessionId.
   *
   * @param {string} sessionId - The sessionId of session to delete
   * @return {Promise<Boolean>} - true if the session has been deleted, false otherwise
   */
  static async deleteOne(sessionId: Types.ObjectId | string): Promise<boolean> {
    const session = await SessionModel.deleteOne({_id: sessionId});
    return session !== null;
  }

  /**
   * Delete all the sessions by the given author
   *
   * @param {string} authorId - The id of author of sessions
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await SessionModel.deleteMany({authorId});
  }
}

export default SessionCollection;
