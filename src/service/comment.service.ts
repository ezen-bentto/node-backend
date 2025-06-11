import { createComment } from './comment/createComment.service';
import { updateComment } from './comment/updateComment.service';
import { deleteComment } from './comment/deleteComment.service';
import { selectComment } from './comment/selectComment.service';


export const CommentService = { createComment, updateComment, deleteComment, selectComment };