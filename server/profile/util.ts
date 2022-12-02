import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Profile, PopulatedProfile} from './model';

// Update this if you add a property to the Post type!
type PostResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  photo: string;
  dateModified: string;
  caption: string;
  focusReflection: string;
  progressReflection: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Post object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Post>} post - A post
 * @returns {PostResponse} - The post object formatted for the frontend
 */
const constructPostResponse = (post: HydratedDocument<Profile>): PostResponse => {
  const postCopy: PopulatedProfile = {
    ...post.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = postCopy.authorId;
  delete postCopy.authorId;
  return {
    ...postCopy,
    _id: postCopy._id.toString(),
    author: username,
    dateCreated: formatDate(post.dateCreated),
    dateModified: formatDate(post.dateModified),
    caption: postCopy.caption,
    // Defaults to empty string if the post type does not have this property.
    focusReflection: postCopy.caption === 'News' ? postCopy.focusReflection : '',
    progressReflection: postCopy.caption === 'Fibe' ? postCopy.progressReflection : ''
  };
};

export {
  constructPostResponse
};
