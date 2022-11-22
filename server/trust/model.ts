import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties of the Trust concept.
 */

export type Trust = {
  _id: Types.ObjectId;
  trustGiverId: Types.ObjectId;
  trustReceiverId: Types.ObjectId;
  dateTrusted: Date;
};

export type PopulatedTrust = {
  _id: Types.ObjectId;
  trustGiverId: User;
  trustReceiverId: User;
  dateTrusted: Date;
};

const TrustSchema = new Schema<Trust>({
  // The user who trusts another user
  trustGiverId: {
    type: Schema.Types.ObjectId, // Use Types.ObjectId outside of the schema
    required: true,
    ref: 'User'
  },
  // The user receiving the trust.
  trustReceiverId: {
    type: Schema.Types.ObjectId, // Use Types.ObjectId outside of the schema
    required: true,
    ref: 'User'
  },
  // The date the post was created
  dateTrusted: {
    type: Date,
    required: true
  }
});

const TrustModel = model<Trust>('Trust', TrustSchema);
export default TrustModel;
