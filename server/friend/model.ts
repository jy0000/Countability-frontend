import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties of the Friend concept.
 */

export type Friend = {
  _id: Types.ObjectId;
  friendGiverId: Types.ObjectId;
  friendReceiverId: Types.ObjectId;
  dateFriended: Date;
};

export type PopulatedFriend = {
  _id: Types.ObjectId;
  friendGiverId: User;
  friendReceiverId: User;
  dateFriended: Date;
};

const FriendSchema = new Schema<Friend>({
  // The user who friends another user
  friendGiverId: {
    type: Schema.Types.ObjectId, // Use Types.ObjectId outside of the schema
    required: true,
    ref: 'User'
  },
  // The user receiving the friend.
  friendReceiverId: {
    type: Schema.Types.ObjectId, // Use Types.ObjectId outside of the schema
    required: true,
    ref: 'User'
  },
  // The date the post was created
  dateFriended: {
    type: Date,
    required: true
  }
});

const FriendModel = model<Friend>('Friend', FriendSchema);
export default FriendModel;
