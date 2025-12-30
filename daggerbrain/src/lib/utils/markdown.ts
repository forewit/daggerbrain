import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Renders markdown to sanitized HTML
 * @param markdown - The markdown string to render
 * @returns Sanitized HTML string safe for rendering
 */
export function renderMarkdown(markdown: string): string {
	if (!markdown || typeof markdown !== 'string') {
		return '';
	}

	// Convert markdown to HTML (synchronous mode)
	// marked.parse() is synchronous by default, but TypeScript types indicate it could be async
	const html = marked.parse(markdown) as string;

	// Sanitize the HTML to prevent XSS attacks
	const sanitized = DOMPurify.sanitize(html);

	return sanitized;
}

