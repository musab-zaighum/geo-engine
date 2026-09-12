#!/usr/bin/env python3
import sys
import json
import asyncio
from typing import Dict, Any

async def run_crawl4ai(url: str) -> Dict[str, Any]:
    try:
        from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode, BrowserConfig
        
        # Configure browser to use NixOS installed Google Chrome / Chromium binary
        browser_config = BrowserConfig(
            headless=True,
            browser_type="chromium",
            executable_path="/run/current-system/sw/bin/google-chrome",
            extra_args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
        )

        run_config = CrawlerRunConfig(
            cache_mode=CacheMode.BYPASS,
            word_count_threshold=10,
            remove_overlay_elements=True,
            exclude_external_links=False
        )

        async with AsyncWebCrawler(config=browser_config, verbose=False) as crawler:
            result = await crawler.arun(url=url, config=run_config)
            
            if result and result.success:
                return {
                    "success": True,
                    "url": result.url or url,
                    "html": result.html or "",
                    "markdown": result.markdown or "",
                    "extracted_content": result.extracted_content or "",
                    "status_code": getattr(result, "status_code", 200),
                    "error_message": ""
                }
            else:
                return {
                    "success": False,
                    "url": url,
                    "html": "",
                    "markdown": "",
                    "extracted_content": "",
                    "status_code": getattr(result, "status_code", 500) if result else 500,
                    "error_message": getattr(result, "error_message", "Crawl failed") if result else "Crawl failed"
                }
    except Exception as e:
        return {
            "success": False,
            "url": url,
            "html": "",
            "markdown": "",
            "extracted_content": "",
            "status_code": 500,
            "error_message": str(e)
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "URL parameter missing"}))
        sys.exit(1)
        
    target_url = sys.argv[1]
    res = asyncio.run(run_crawl4ai(target_url))
    print(json.dumps(res))
