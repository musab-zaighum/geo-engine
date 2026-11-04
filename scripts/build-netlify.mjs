#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const OUT_DIR = path.join(ROOT_DIR, 'dist-netlify');

console.log('🚀 Generating Netlify Drop static package at:', OUT_DIR);

if (fs.existsSync(OUT_DIR)) {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUT_DIR, { recursive: true });

// 1. Copy static assets from .next/static to dist-netlify/_next/static
const nextStaticSrc = path.join(ROOT_DIR, '.next/static');
const nextStaticDest = path.join(OUT_DIR, '_next/static');
if (fs.existsSync(nextStaticSrc)) {
  fs.mkdirSync(nextStaticDest, { recursive: true });
  fs.cpSync(nextStaticSrc, nextStaticDest, { recursive: true });
  console.log('✓ Copied .next/static -> dist-netlify/_next/static');
} else {
  console.error('❌ Error: .next/static directory not found. Please run "next build" first.');
  process.exit(1);
}

// 2. Copy public directory assets to root of dist-netlify
const publicSrc = path.join(ROOT_DIR, 'public');
if (fs.existsSync(publicSrc)) {
  fs.cpSync(publicSrc, OUT_DIR, { recursive: true });
  console.log('✓ Copied public/* assets to dist-netlify/');
}

// 3. Map pre-rendered HTML files
const htmlMap = [
  { src: '.next/server/app/index.html', dest: 'index.html' },
  { src: '.next/server/app/licensing.html', dest: 'licensing/index.html' },
  { src: '.next/server/app/partner-console.html', dest: 'partner-console/index.html' },
  { src: '.next/server/app/pricing.html', dest: 'pricing/index.html' },
  { src: '.next/server/app/login.html', dest: 'login/index.html' },
  { src: '.next/server/app/signup.html', dest: 'signup/index.html' },
  { src: '.next/server/app/_not-found.html', dest: '404.html' },
];

let copiedHtmlCount = 0;
for (const { src, dest } of htmlMap) {
  const fullSrc = path.join(ROOT_DIR, src);
  const fullDest = path.join(OUT_DIR, dest);
  if (fs.existsSync(fullSrc)) {
    fs.mkdirSync(path.dirname(fullDest), { recursive: true });
    fs.copyFileSync(fullSrc, fullDest);
    copiedHtmlCount++;
  } else {
    console.warn(`⚠️ Warning: Pre-rendered HTML not found for ${src}`);
  }
}
console.log(`✓ Mapped ${copiedHtmlCount}/${htmlMap.length} pre-rendered HTML routes`);

// 4. Create Netlify Drop _redirects file
const redirectsContent = `# Netlify Drop Redirects & SPA Fallback
/white-label    /partner-console    301!
/api/*          https://nexusrank1.com/api/:splat  200
/*              /index.html         200
`;
fs.writeFileSync(path.join(OUT_DIR, '_redirects'), redirectsContent, 'utf8');
console.log('✓ Created dist-netlify/_redirects');

// 5. Create Netlify _headers file for caching & security
const headersContent = `/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
`;
fs.writeFileSync(path.join(OUT_DIR, '_headers'), headersContent, 'utf8');
console.log('✓ Created dist-netlify/_headers');

console.log('✅ Netlify Drop distribution package ready in dist-netlify/ for drag-and-drop deployment!');
