import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {FriendRequest, PopulatedFriendRequest} from './model';

type response = {
  _id: string;
  friendRequestSenderName: string;
  friendRequestReceiverName: string;
  dateCreated: string;
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
 * @param {HydratedDocument<FriendRequest>} friendRequest - A request for friendship made by the sender to the receiver.
 * @returns {response} - The post object formatted for the frontend
 */
const constructResponse = (friendRequest: HydratedDocument<FriendRequest>): response => {
  const copy: PopulatedFriendRequest = {
    ...friendRequest.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  // Avoid mutation and aliasing
  const requestSenderName = copy.friendRequestSenderId.username;
  const requestReceiverName = copy.friendRequestReceiverId.username;
  delete copy.friendRequestSenderId;
  delete copy.friendRequestReceiverId;

  return {
    ...copy,
    _id: copy._id.toString(),
    friendRequestSenderName: requestSenderName,
    friendRequestReceiverName: requestReceiverName,
    dateCreated: formatDate(friendRequest.dateCreated)
  };
};

export {
  constructResponse
};
