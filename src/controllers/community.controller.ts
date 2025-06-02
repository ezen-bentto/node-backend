import { regCommunityPost } from './community/regCommunityPost.controller';
import { modCommunityPost } from './community/modCommunityPost.controller';
import { delCommunityPost } from './community/delCommunityPost.controller';


const communityController = { regCommunityPost, modCommunityPost, delCommunityPost };

export default communityController;