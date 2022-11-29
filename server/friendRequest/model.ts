import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * A model representing a FriendRequest request from User A to User B.
 */

export type FriendRequest = {
  _id: Types.ObjectId;
  friendRequestSenderId: Types.ObjectId;
  friendRequestReceiverId: Types.ObjectId;
  dateCreated: Date;
};

export type PopulatedFriendRequest = {
  _id: Types.ObjectId;
  friendRequestSender: User;
  friendRequestReceiver: User;
  dateCreated: Date;
};

const FriendRequestSchema = new Schema<FriendRequest>({
  // A user who requests to friend another user.
  friendRequestSenderId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // A user who requests the friend request.
  friendRequestReceiverId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date when the friend request is made.
  dateCreated: {
    type: Date,
    required: true
  }
});

const FriendRequestModel = model<FriendRequest>('FriendRequest', FriendRequestSchema);
export default FriendRequestModel;
