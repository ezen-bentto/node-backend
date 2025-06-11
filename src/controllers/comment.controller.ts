import { regComment } from './comment/regComment.controller';
import { modComment } from './comment/modComment.controller';
import { delComment } from './comment/delComment.controller';
import { getComment } from './comment/getComment.controller';


const commentController = { regComment, modComment, delComment, getComment };

export default commentController;