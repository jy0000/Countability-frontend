import type {HydratedDocument, Types} from 'mongoose';
import type {Drawing} from './model';
import DrawingModel from './model';
import UserCollection from '../user/collection';
import FriendCollection from '../friend/collection';

/**
 * This files contains a class that has the functionality to explore drawings
 * stored in MongoDB, including adding, finding, updating, and deleting drawings.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Drawing> is the output of the DrawingModel() constructor,
 * and contains all the information in Drawing. https://mongoosejs.com/docs/typescript.html
 */
class DrawingCollection {
  /**
   * Add a drawing to the collection
   *
   * @param {string} authorId - The id of the author of the drawing
   * @param {string} pixels - The id of the pixels of the drawing
   * @return {Promise<HydratedDocument<Drawing>>} - The newly created drawing
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    pixels: number[],
    width: number,
    height: number
  ): Promise<HydratedDocument<Drawing>> {
    const date = new Date();
    const drawing = new DrawingModel({
      authorId,
      dateCreated: date,
      pixels,
      dateModified: date,
      width,
      height
    });
    await drawing.save(); // Saves drawing to MongoDB
    return drawing.populate('authorId');
  }

  /**
   * Find a drawing by drawingId
   *
   * @param {string} drawingId - The id of the drawing to find
   * @return {Promise<HydratedDocument<Drawing>> | Promise<null> } - The drawing with the given drawingId, if any
   */
  static async findOne(drawingId: Types.ObjectId | string): Promise<HydratedDocument<Drawing>> {
    return DrawingModel.findOne({_id: drawingId}).populate('authorId');
  }

  /**
   * Get all the drawings in the database
   *
   * @return {Promise<HydratedDocument<Drawing>[]>} - An array of all of the drawings
   */
  static async findAll(): Promise<Array<HydratedDocument<Drawing>>> {
    // Retrieves drawings and sorts them from most to least recent
    return DrawingModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the drawings in by given author
   *
   * @param {string} username - The username of author of the drawings
   * @return {Promise<HydratedDocument<Drawing>[]>} - An array of all of the drawings
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Drawing>>> {
    const author = await UserCollection.findOneByUsername(username);
    return DrawingModel.find({authorId: author._id}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the drawings in by given type
   *
   * @param {string} targetDrawingType - The drawing type desired.
   * @return {Promise<HydratedDocument<Drawing>[]>} - An array of all of the drawings
   */
  static async findAllByDrawingType(targetDrawingType: string): Promise<Array<HydratedDocument<Drawing>>> {
    return DrawingModel.find({width: targetDrawingType}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the drawings in by given type
   *
   * @param {string} currentUserId - The current user Id
   * @return {Promise<HydratedDocument<Drawing>[]>} - An array of all of the drawings
   */
  static async findAllByFriendedUsers(currentUserId: string): Promise<Array<HydratedDocument<Drawing>>> {
    const allFriends = await FriendCollection.findAllFriendGivenById(currentUserId);
    const allFriendedUserIds = allFriends.map(friend => friend.friendReceiverId._id);
    const drawingsFromFriendedUsers = await DrawingModel.find({authorId: {$in: allFriendedUserIds}}).sort({dateModified: -1}).populate('authorId');
    return drawingsFromFriendedUsers;
  }

  /**
   * Update a drawing with the new pixels
   *
   * @param {string} drawingId - The id of the drawing to be updated
   * @param {number[]} pixels - The new pixels of the drawing
   * @return {Promise<HydratedDocument<Drawing>>} - The newly updated drawing
   */
  static async updateOne(drawingId: Types.ObjectId | string, pixels: number[]): Promise<HydratedDocument<Drawing>> {
    const drawing = await DrawingModel.findOne({_id: drawingId});
    drawing.pixels = pixels;
    drawing.dateModified = new Date();
    await drawing.save();
    return drawing.populate('authorId');
  }

  /**
   * Delete a drawing with given drawingId.
   *
   * @param {string} drawingId - The drawingId of drawing to delete
   * @return {Promise<Boolean>} - true if the drawing has been deleted, false otherwise
   */
  static async deleteOne(drawingId: Types.ObjectId | string): Promise<boolean> {
    const drawing = await DrawingModel.deleteOne({_id: drawingId});
    return drawing !== null;
  }

  /**
   * Delete all the drawings by the given author
   *
   * @param {string} authorId - The id of author of drawings
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await DrawingModel.deleteMany({authorId});
  }
}

export default DrawingCollection;
