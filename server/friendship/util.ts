import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Friend, PopulatedFriend} from './model';

type FriendResponse = {
  _id: string;
  friendGiver: string;
  friendReceiver: string;
  dateFriended: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Friend object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Friend>} friend - A friend
 * @returns {FriendResponse} - The post object formatted for the frontend
 */
const constructFriendResponse = (friend: HydratedDocument<Friend>): FriendResponse => {
  const friendCopy: PopulatedFriend = {
    ...friend.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const friendGiverUsername = friendCopy.friendGiverId.username;
  const friendReceiverUsername = friendCopy.friendReceiverId.username;
  delete friendCopy.friendGiverId;
  delete friendCopy.friendReceiverId;
  return {
    ...friendCopy,
    _id: friendCopy._id.toString(),
    friendGiver: friendGiverUsername,
    friendReceiver: friendReceiverUsername, // Actual response include human-readable info
    dateFriended: formatDate(friend.dateFriended)
  };
};

export {
  constructFriendResponse
};
