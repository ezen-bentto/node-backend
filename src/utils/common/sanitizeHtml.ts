import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export const sanitizeHtml = (html: string) => {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'p', 'b', 'i', 'u', 'a', 'ul', 'ol', 'li', 'br', 'span',
            'strong', 'em', 'blockquote', 'code', 'pre', 'img',
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'style'],
    });
};