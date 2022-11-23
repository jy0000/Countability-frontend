import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Post
 */

export type Post = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  dateCreated: Date;
  photo: string;
  dateModified: Date;
  caption: string;
  focusReflection: string; // News post property
  progressReflection: string; // Fibe post property
};

export type PopulatedPost = {
  _id: Types.ObjectId;
  authorId: User;
  dateCreated: Date;
  photo: string;
  dateModified: Date;
  caption: string;
  focusReflection: string; // News post property
  progressReflection: string; // Fibe post property
};

const PostSchema = new Schema<Post>({
  // The author userId
  authorId: {
    type: Schema.Types.ObjectId, // Use Types.ObjectId outside of the schema
    required: true,
    ref: 'User'
  },
  // The date the post was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The photo of the post
  photo: {
    type: String,
    required: true
  },
  // The date the post was modified
  dateModified: {
    type: Date,
    required: true
  },
  // The type of the post
  caption: {
    type: String,
    required: true
  },
  // News post property
  focusReflection: {
    type: String,
    required: false // Required for all, but default value is empty string for Fibe post
  },
  // Fibe post property
  progressReflection: {
    type: String,
    required: false // Required for all, but default value is empty string for Fibe post
  }
});

const PostModel = model<Post>('Post', PostSchema);
export default PostModel;
