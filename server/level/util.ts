import type {HydratedDocument} from 'mongoose';
import type {Level} from './model';

type LevelResponse = {
  _id: string;
  username: string;
  currentLevel: number;
  canEndorse: boolean;
  canUpvote: boolean;
};

/**
 * Transform a raw Level object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Level>} level - A level
 * @returns {LevelResponse} - The post object formatted for the frontend
 */
const constructLevelResponse = (level: HydratedDocument<Level>): LevelResponse => {
  const levelCopy: Level = {
    ...level.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    _id: levelCopy._id.toString(),
    username: levelCopy.username,
    currentLevel: levelCopy.level,
    canEndorse: level.privileges.get('canEndorse'),
    canUpvote: level.privileges.get('canUpvote')
  };
};

export {
  constructLevelResponse
};
