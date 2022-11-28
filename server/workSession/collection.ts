import type {HydratedDocument, Types} from 'mongoose';
import type {WorkSession} from './model';
import WorkSessionModel from './model';
import UserCollection from '../user/collection';
import FriendCollection from '../friend/collection';

/**
 * A class representing a work session for a user.
 */
class WorkSessionCollection {
  /**
   * Add a WorkSession to the collection
   *
   * @param {string} authorId - The id of the author of the WorkSession
   * @param {string} content - The id of the content of the WorkSession
   * @return {Promise<HydratedDocument<WorkSession>>} - The newly created WorkSession
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    content: string,
    WorkSessionType: string,
    sourceLink: string,
    emoji: string
  ): Promise<HydratedDocument<WorkSession>> {
    const date = new Date();
    const WorkSession = new WorkSessionModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date,
      WorkSessionType,
      sourceLink,
      emoji
    });
    await WorkSession.save(); // Saves WorkSession to MongoDB
    return WorkSession.populate('authorId');
  }

  /**
   * Find a WorkSession by WorkSessionId
   *
   * @param {string} WorkSessionId - The id of the WorkSession to find
   * @return {Promise<HydratedDocument<WorkSession>> | Promise<null> } - The WorkSession with the given WorkSessionId, if any
   */
  static async findOne(WorkSessionId: Types.ObjectId | string): Promise<HydratedDocument<WorkSession>> {
    return WorkSessionModel.findOne({_id: WorkSessionId}).populate('authorId');
  }

  /**
   * Get all the WorkSessions in the database
   *
   * @return {Promise<HydratedDocument<WorkSession>[]>} - An array of all of the WorkSessions
   */
  static async findAll(): Promise<Array<HydratedDocument<WorkSession>>> {
    // Retrieves WorkSessions and sorts them from most to least recent
    return WorkSessionModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the WorkSessions in by given author
   *
   * @param {string} username - The username of author of the WorkSessions
   * @return {Promise<HydratedDocument<WorkSession>[]>} - An array of all of the WorkSessions
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<WorkSession>>> {
    const author = await UserCollection.findOneByUsername(username);
    return WorkSessionModel.find({authorId: author._id}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the WorkSessions in by given type
   *
   * @param {string} targetWorkSessionType - The WorkSession type desired.
   * @return {Promise<HydratedDocument<WorkSession>[]>} - An array of all of the WorkSessions
   */
  static async findAllByWorkSessionType(targetWorkSessionType: string): Promise<Array<HydratedDocument<WorkSession>>> {
    return WorkSessionModel.find({WorkSessionType: targetWorkSessionType}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the WorkSessions in by given type
   *
   * @param {string} currentUserId - The current user Id
   * @return {Promise<HydratedDocument<WorkSession>[]>} - An array of all of the WorkSessions
   */
  static async findAllByFriendedUsers(currentUserId: string): Promise<Array<HydratedDocument<WorkSession>>> {
    const allFriends = await FriendCollection.findAllFriendGivenById(currentUserId);
    const allFriendedUserIds = allFriends.map(friend => friend.friendReceiverId._id);
    const WorkSessionsFromFriendedUsers = await WorkSessionModel.find({authorId: {$in: allFriendedUserIds}}).sort({dateModified: -1}).populate('authorId');
    return WorkSessionsFromFriendedUsers;
  }

  /**
   * Update a WorkSession with the new content
   *
   * @param {string} WorkSessionId - The id of the WorkSession to be updated
   * @param {string} content - The new content of the WorkSession
   * @return {Promise<HydratedDocument<WorkSession>>} - The newly updated WorkSession
   */
  static async updateOne(WorkSessionId: Types.ObjectId | string, content: string): Promise<HydratedDocument<WorkSession>> {
    const WorkSession = await WorkSessionModel.findOne({_id: WorkSessionId});
    WorkSession.content = content;
    WorkSession.dateModified = new Date();
    await WorkSession.save();
    return WorkSession.populate('authorId');
  }

  /**
   * Delete a WorkSession with given WorkSessionId.
   *
   * @param {string} WorkSessionId - The WorkSessionId of WorkSession to delete
   * @return {Promise<Boolean>} - true if the WorkSession has been deleted, false otherwise
   */
  static async deleteOne(WorkSessionId: Types.ObjectId | string): Promise<boolean> {
    const WorkSession = await WorkSessionModel.deleteOne({_id: WorkSessionId});
    return WorkSession !== null;
  }

  /**
   * Delete all the WorkSessions by the given author
   *
   * @param {string} authorId - The id of author of WorkSessions
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await WorkSessionModel.deleteMany({authorId});
  }
}

export default WorkSessionCollection;
