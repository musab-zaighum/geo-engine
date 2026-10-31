function normalizeDomain(rawDomain: string): string {
  if (!rawDomain) return '';
  let clean = rawDomain.trim().toLowerCase();
  clean = clean.replace(/^https?:\/\//, '');
  clean = clean.split('/')[0];
  clean = clean.split(/[?#]/)[0];
  // Strip userinfo (basic auth: user:pass@ or user@)
  clean = clean.replace(/^[^@]+@/, '');
  // Strip port
  clean = clean.split(':')[0];
  // Strip trailing DNS dots
  clean = clean.replace(/\.+$/, '');
  if (clean.startsWith('www.')) {
    clean = clean.slice(4);
  }
  // Strip trailing DNS dots again
  clean = clean.replace(/\.+$/, '');
  return clean;
}

console.log('midatlanticdental.com.:', normalizeDomain('midatlanticdental.com.'));
console.log('user:pass@midatlanticdental.com:', normalizeDomain('http://user:pass@midatlanticdental.com'));
console.log('user:pass@clearchoice.com:8080:', normalizeDomain('http://user:pass@clearchoice.com:8080'));
console.log('WWW.HEARTLAND.COM.:', normalizeDomain('https://WWW.HEARTLAND.COM./path?q=1'));

const TIER_5_ATS_REGEX =
  /(boards\.greenhouse\.io\/[^\s"'<>]*?(tag|heartland|aspendental|pacificdentalservices|mb2dental|sonrava|smilebrands|clearchoice)|(?:[a-z0-9-]+\.myworkdayjobs\.com\/(?:[^\s"'<>/]+\/)?(heartland|aspen|pds|clearchoice|tag|mb2dental|sonrava|smilebrands)|(heartland|aspen|pds|clearchoice|tag|mb2dental|sonrava|smilebrands)\.myworkdayjobs\.com)|jobs\.lever\.co\/(clearchoice|mb2dental|specialty1)|ultipro\.com\/[a-z0-9-]+\/jobboard)/i;

const workdayHtml = '<a href="https://heartland.myworkdayjobs.com/careers">';
const greenhouseEmbedHtml = '<div><iframe src="https://boards.greenhouse.io/embed/job_board?for=heartland"></iframe></div>';
const leverHtml = '<a href="https://jobs.lever.co/clearchoice/12345">';

console.log('workday regex test:', TIER_5_ATS_REGEX.test(workdayHtml));
console.log('greenhouse embed regex test:', TIER_5_ATS_REGEX.test(greenhouseEmbedHtml));
console.log('lever regex test:', TIER_5_ATS_REGEX.test(leverHtml));

function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

const htmlWithStrong = '<p>Dental care is supported by <strong>Heartland Dental</strong>, LLC.</p>';
const htmlWithAnchor = '<footer>Supported by <a href="https://heartland.com">Heartland Dental</a></footer>';

const TIER_4_SPECIFIC_DSO_REGEXES = [
  { name: 'Heartland Dental', regex: /\b(supported\s+by\s+heartland\s+dental|heartland\s+dental,\s+llc)\b/i },
];

console.log('Raw with strong:', TIER_4_SPECIFIC_DSO_REGEXES[0].regex.test(htmlWithStrong));
console.log('Clean with strong:', TIER_4_SPECIFIC_DSO_REGEXES[0].regex.test(stripHtmlTags(htmlWithStrong)));
console.log('Raw with anchor:', TIER_4_SPECIFIC_DSO_REGEXES[0].regex.test(htmlWithAnchor));
console.log('Clean with anchor:', TIER_4_SPECIFIC_DSO_REGEXES[0].regex.test(stripHtmlTags(htmlWithAnchor)));
