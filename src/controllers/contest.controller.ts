import { create } from './contest/create.controller';
import { remove } from './contest/delete.controller';
import { detail } from './contest/detail.controller';
import { list } from './contest/list.controller';
import { update } from './contest/update.controller';

const ContestController = { detail, list, create, update, remove };

export default ContestController;
