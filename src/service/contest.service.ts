import { create } from './contest/create.service';
import { remove } from './contest/delete.service';
import { detail } from './contest/detail.service';
import { list } from './contest/list.service';
import { update } from './contest/update.service';

export const ContestService = { detail, list, create, update, remove };
