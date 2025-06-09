import { regCommunityPost } from './community/regCommunityPost.controller';
import { modCommunityPost } from './community/modCommunityPost.controller';
import { delCommunityPost } from './community/delCommunityPost.controller';
import { getCommunityList } from './community/getCommunityList.controller';
import { getCommunityDetail } from './community/getCommunityDetail.controller';




const communityController = { regCommunityPost, modCommunityPost, delCommunityPost, getCommunityList, getCommunityDetail };

export default communityController;