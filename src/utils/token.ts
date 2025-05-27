import { getNewAccessToken } from './token/getNewAccessToken';
import { getNewRefreshToken } from './token/getNewRefreshToken ';
import { validTokenCheck } from './token/validTokenCheck';
import { verifyAccessToken } from './token/verifyAccessToken';

export const Token = { getNewAccessToken, validTokenCheck, getNewRefreshToken, verifyAccessToken };
