import type {HydratedDocument, Types} from 'mongoose';
import type {Point} from './model';
import PointModel from './model';

/**
 * This files contains a class that has the functionality to explore friend
 * stored in MongoDB, including CRUD operations.
 */
class PointCollection {
  /** Operations:
   *  addOne - Add point of the user (only in user creation)
   *  findOne - Find current point object
   *  updateOne - Update user's point
   *  deleteOne - Delete user's point, called when the user profile is deleted too
   */
  /**
   * Add point of the user (only in user creation).
   *
   * @param {string} currentusername - The id of the current user
   * @return {Promise<HydratedDocument<Point>>} - The new point associated with this user.
   *
   */
  static async addOne(
    currentUsername: string
  ): Promise<HydratedDocument<Point>> {
    // Use current amount of posts by this user to determine point
    const allowedPriviledges = new Map<string, boolean>();
    allowedPriviledges.set('canUpvote', false);
    allowedPriviledges.set('canEndorse', false);

    const userPoint = new PointModel({
      point: 0, // Starts at 0
      username: currentUsername
    });
    await userPoint.save(); // Saves point to MongoDB
    return userPoint.populate(['point', 'username']);
  }

  /**
   * Find current point object
   *
   * @param {string} pointId - The point id
   * @return {Promise<HydratedDocument<Post>> | Promise<null> } - The friend relation between the two users.
   */
  static async findOne(pointId: Types.ObjectId | string): Promise<HydratedDocument<Point>> {
    return PointModel.findOne({_id: pointId});
  }

  static async deleteEverything(
  ): Promise<HydratedDocument<Point>> {
    return PointModel.remove();
  }

  /**
   * Update user's point
   *
   * @param {Types.ObjectId | string} pointId - The pointId of the user to update
   * @param {string} userPosts - All existing posts of the user, used to determine point.
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async updateOne(pointId: Types.ObjectId | string, delta: number): Promise<HydratedDocument<Point>> {
    const userPoint = await PointModel.findOne({_id: pointId});
    console.log(userPoint);
    console.log(delta);
    userPoint.point += delta;
    await userPoint.save();
    return userPoint.populate(['point', 'username']);
    return userPoint;
  }

  /**
   * Delete user's point, called when the user profile is deleted too
   *
   * @param {Types.ObjectId | string} pointId - The user id
   * @return {Promise<boolean>} - The deleted point
   */
  static async deleteOne(pointId: Types.ObjectId | string): Promise<boolean> {
    const userPoint = await PointModel.deleteOne({_id: pointId});
    return userPoint !== null;
  }
}

export default PointCollection;
