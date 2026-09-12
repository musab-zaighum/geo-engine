import { CmsGuide } from './types';

export const CMS_GUIDES: CmsGuide[] = [
  {
    id: 'wordpress',
    name: 'WordPress / WooCommerce',
    iconName: 'Globe',
    schemaInstructions: {
      method1Title: 'Method 1: Safe Free Plugin (Recommended)',
      method1Steps: [
        'Log in to your WordPress Dashboard.',
        'Navigate to Plugins -> Add New.',
        'Search for "WPCode – Insert Headers and Footers".',
        'Install and Activate the plugin.',
        'Go to Code Snippets -> Header & Footer.',
        'Paste your copied <script type="application/ld+json">...</script> block into the Header box.',
        'Click Save Changes. Your Schema is now live site-wide!',
      ],
      method2Title: 'Method 2: Theme File Editor (No Plugins)',
      method2Steps: [
        'Go to Appearance -> Theme File Editor.',
        'On the right sidebar, click theme files -> header.php (Theme Header).',
        'Scroll down until you see the closing </head> tag.',
        'Paste your JSON-LD script block on the line directly BEFORE </head>.',
        'Click Update File.',
      ],
    },
    llmsTxtInstructions: {
      title: 'Hosting /llms.txt on WordPress',
      steps: [
        'Option A (cPanel / SFTP): Upload the downloaded llms.txt file to your site root directory (public_html/llms.txt).',
        'Option B (Virtual File / Plugin): Use a plugin like "Redirection" or "301 Redirects" to map the request URL domain.com/llms.txt to your hosted file URL.',
        'Test in browser by visiting: https://yourdomain.com/llms.txt (Should return 200 OK text).',
      ],
    },
  },
  {
    id: 'shopify',
    name: 'Shopify Store',
    iconName: 'ShoppingBag',
    schemaInstructions: {
      method1Title: 'Pasting JSON-LD Schema into theme.liquid',
      method1Steps: [
        'Log in to your Shopify Admin Panel.',
        'Navigate to Online Store -> Themes.',
        'Click the "..." (Actions) button next to your active theme -> Edit Code.',
        'Under the Layout folder on the left, click theme.liquid.',
        'Scroll down or press Ctrl+F to find the closing </head> tag.',
        'Paste your copied <script type="application/ld+json">...</script> snippet directly ABOVE </head>.',
        'Click Save in the top right corner.',
      ],
    },
    llmsTxtInstructions: {
      title: 'Hosting /llms.txt on Shopify',
      steps: [
        'Go to Settings -> Files in your Shopify Admin.',
        'Click Upload Files and select your downloaded llms.txt file.',
        'Copy the generated CDN URL for the uploaded file.',
        'Navigate to Online Store -> Navigation -> View URL Redirects.',
        'Click Create URL Redirect.',
        'Set Redirect from: /llms.txt',
        'Set Redirect to: [Paste the copied Shopify CDN file link]',
        'Click Save Redirect. Visiting domain.com/llms.txt will now serve your file!',
      ],
    },
  },
  {
    id: 'webflow',
    name: 'Webflow',
    iconName: 'Layout',
    schemaInstructions: {
      method1Title: 'Injecting Custom Head Code in Webflow',
      method1Steps: [
        'Open your Webflow Dashboard and select your project.',
        'Click Project Settings (Gear icon) -> Custom Code.',
        'In the "Head Code" textarea, paste your JSON-LD script block.',
        'Click Save Changes.',
        'Publish your site to your custom domain for changes to take effect.',
      ],
    },
    llmsTxtInstructions: {
      title: 'Hosting /llms.txt on Webflow',
      steps: [
        'Upload your llms.txt file to Assets in Webflow.',
        'Go to Project Settings -> Hosting -> 301 Redirects.',
        'Set Old Path: /llms.txt',
        'Set Redirect to Path: [Webflow Asset URL]',
        'Click Add Redirect and Publish Site.',
      ],
    },
  },
  {
    id: 'squarespace',
    name: 'Squarespace / Wix',
    iconName: 'Layers',
    schemaInstructions: {
      method1Title: 'Squarespace Code Injection',
      method1Steps: [
        'Log in to Squarespace -> Settings -> Developer Tools -> Code Injection.',
        'Paste your JSON-LD script block into the "Header" box.',
        'Click Save.',
      ],
      method2Title: 'Wix Custom Code',
      method2Steps: [
        'Log in to Wix Dashboard -> Settings -> Custom Code (under Advanced).',
        'Click + Add Custom Code in the top right.',
        'Paste your JSON-LD code into the box.',
        'Set "Place Code in" to "Head".',
        'Set "Apply to" to "All Pages".',
        'Click Apply.',
      ],
    },
    llmsTxtInstructions: {
      title: 'Hosting /llms.txt on Squarespace / Wix',
      steps: [
        'Upload the llms.txt file to Link Files / Assets manager.',
        'Create a 301 URL redirect from /llms.txt to the file URL under URL Mappings / Redirects.',
        'Verify by visiting https://yourdomain.com/llms.txt.',
      ],
    },
  },
];
