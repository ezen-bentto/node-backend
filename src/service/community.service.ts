import { createCommunityPost } from './community/createCommunityPost.service';
import { updateCommunityPost } from './community/updateCommunityPost.service';
import { deleteCommunityPost } from './community/deleteCommunityPost.service';
import { selectCommunityList } from './community/selectCommunityList.service';
import { selectCommunityDetail } from './community/selectCommunityDetail.service';




export const CommunityService = { createCommunityPost, updateCommunityPost, deleteCommunityPost, selectCommunityList, selectCommunityDetail };