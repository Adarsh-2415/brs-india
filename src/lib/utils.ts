import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') return html;
  
  let clean = html;
  
  // 1. Remove script tags and their contents
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // 2. Remove iframe tags and their contents
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // 3. Remove object, embed, and applet tags
  clean = clean.replace(/<(object|embed|applet)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '');
  
  // 4. Remove SVG and Math tags to prevent SVG/Math-based XSS injection
  clean = clean.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '');
  clean = clean.replace(/<math\b[^<]*(?:(?!<\/math>)<[^<]*)*<\/math>/gi, '');
  
  // 5. Remove event handlers (e.g. onload, onerror, onclick, etc.)
  clean = clean.replace(/\son\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]*)/gi, '');
  
  // 6. Remove dangerous URIs in href, src, action, background (javascript:, vbscript:, data:)
  clean = clean.replace(/(?:href|src|action|background)\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*"|javascript:[^\s>]*|'data:[^']*'|"data:[^"]*"|data:[^\s>]*|'vbscript:[^']*'|"vbscript:[^"]*"|vbscript:[^\s>]*)/gi, '');
  
  // 7. Strip empty/malformed brackets
  clean = clean.replace(/<[/\s]*>/g, '');
  
  return clean;
}
