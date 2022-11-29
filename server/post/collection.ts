import type {HydratedDocument, Types} from 'mongoose';
import type {Post} from './model';
import PostModel from './model';
import UserCollection from '../user/collection';
import FriendCollection from '../friendship/collection';

/**
 * This files contains a class that has the functionality to explore posts
 * stored in MongoDB, including adding, finding, updating, and deleting posts.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Post> is the output of the PostModel() constructor,
 * and contains all the information in Post. https://mongoosejs.com/docs/typescript.html
 */
class PostCollection {
  /** Operations:
   *  addOne - Add a post to the collection
   *  findOne - Find a post by postId
   *  findAll - Get all the posts in the database
   *  findAllByUsername - Get all the posts in by given author
   *  findAllByPostType - Get all the posts in by given type
   *  findAllByFriendedUsers - Get all the posts in by given type
   *  updateOne - Update a post with the new photo
   *  deleteOne - Delete a post with given postId.
   *  deleteMany - Delete all the posts by the given author
   */


  /**
   * Add a post to the collection
   *
   * @param {string} authorId - The id of the author of the post
   * @param {string} photo - The id of the photo of the post
   * @return {Promise<HydratedDocument<Post>>} - The newly created post
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    photo: string,
    caption: string,
    focusReflection: string,
    progressReflection: string
  ): Promise<HydratedDocument<Post>> {
    const date = new Date();
    const post = new PostModel({
      authorId,
      dateCreated: date,
      photo,
      dateModified: date,
      caption,
      focusReflection,
      progressReflection
    });
    await post.save(); // Saves post to MongoDB
    return post.populate('authorId');
  }

  /**
   * Find a post by postId
   *
   * @param {string} postId - The id of the post to find
   * @return {Promise<HydratedDocument<Post>> | Promise<null> } - The post with the given postId, if any
   */
  static async findOne(postId: Types.ObjectId | string): Promise<HydratedDocument<Post>> {
    return PostModel.findOne({_id: postId}).populate('authorId');
  }

  /**
   * Get all the posts in the database
   *
   * @return {Promise<HydratedDocument<Post>[]>} - An array of all of the posts
   */
  static async findAll(): Promise<Array<HydratedDocument<Post>>> {
    // Retrieves posts and sorts them from most to least recent
    return PostModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the posts in by given author
   *
   * @param {string} username - The username of author of the posts
   * @return {Promise<HydratedDocument<Post>[]>} - An array of all of the posts
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Post>>> {
    const author = await UserCollection.findOneByUsername(username);
    return PostModel.find({authorId: author._id}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the posts in by given type
   *
   * @param {string} targetPostType - The post type desired.
   * @return {Promise<HydratedDocument<Post>[]>} - An array of all of the posts
   */
  static async findAllByPostType(targetPostType: string): Promise<Array<HydratedDocument<Post>>> {
    return PostModel.find({caption: targetPostType}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the posts in by given type
   *
   * @param {string} currentUserId - The current user Id
   * @return {Promise<HydratedDocument<Post>[]>} - An array of all of the posts
   */
  static async findAllByFriendedUsers(currentUserId: string): Promise<Array<HydratedDocument<Post>>> {
    const allFriends = await FriendCollection.findAllFriendGivenById(currentUserId);
    const allFriendedUserIds = allFriends.map(friend => friend.friendReceiverId._id);
    const postsFromFriendedUsers = await PostModel.find({authorId: {$in: allFriendedUserIds}}).sort({dateModified: -1}).populate('authorId');
    return postsFromFriendedUsers;
  }

  /**
   * Update a post with the new photo
   *
   * @param {string} postId - The id of the post to be updated
   * @param {string} photo - The new photo of the post
   * @return {Promise<HydratedDocument<Post>>} - The newly updated post
   */
  static async updateOne(postId: Types.ObjectId | string, photo: string): Promise<HydratedDocument<Post>> {
    const post = await PostModel.findOne({_id: postId});
    post.photo = photo;
    post.dateModified = new Date();
    await post.save();
    return post.populate('authorId');
  }

  /**
   * Delete a post with given postId.
   *
   * @param {string} postId - The postId of post to delete
   * @return {Promise<Boolean>} - true if the post has been deleted, false otherwise
   */
  static async deleteOne(postId: Types.ObjectId | string): Promise<boolean> {
    const post = await PostModel.deleteOne({_id: postId});
    return post !== null;
  }

  /**
   * Delete all the posts by the given author
   *
   * @param {string} authorId - The id of author of posts
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await PostModel.deleteMany({authorId});
  }
}

export default PostCollection;
