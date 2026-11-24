import { NextRequest, NextResponse } from 'next/server';

const GITHUB_OWNER = 'Ab-Coder123';
const GITHUB_REPO = 'task-management-app';
const LATEST_RELEASE_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;
const DIRECT_DOWNLOAD_BASE = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest/download`;

interface GitHubAsset {
  name: string;
  browser_download_url: string;
}

interface PlatformTarget {
  exactName: string;
  extension: string;
  mustInclude?: string;
  mustExclude?: string;
}

function getPlatformTarget(platform: string, type: string | null): PlatformTarget | null {
  switch (platform.toLowerCase()) {
    case 'windows':
    case 'win':
      if (type === 'portable') {
        return {
          exactName: 'TaskSaaS-Portable-Win-x64.exe',
          extension: '.exe',
          mustInclude: 'portable',
        };
      }
      return {
        exactName: 'TaskSaaS-Setup-Win-x64.exe',
        extension: '.exe',
        mustExclude: 'portable',
      };

    case 'macos':
    case 'mac':
      if (type === 'zip') {
        return {
          exactName: 'TaskSaaS-macOS.zip',
          extension: '.zip',
        };
      }
      return {
        exactName: 'TaskSaaS-macOS.dmg',
        extension: '.dmg',
      };

    case 'linux':
      return {
        exactName: 'TaskSaaS-Linux.AppImage',
        extension: '.appimage',
      };

    default:
      return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const type = request.nextUrl.searchParams.get('type');
  const target = getPlatformTarget(params.platform, type);

  if (!target) {
    return NextResponse.redirect(new URL('/download', request.url), 302);
  }

  let downloadUrl = `${DIRECT_DOWNLOAD_BASE}/${target.exactName}`;

  try {
    const response = await fetch(LATEST_RELEASE_API, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'TaskSaaS-Download-Router',
      },
      next: { revalidate: 60 },
    });

    if (response.ok) {
      const release = (await response.json()) as { assets?: GitHubAsset[] };
      const assets = release.assets ?? [];

      const exactMatch = assets.find(
        (asset) => asset.name.toLowerCase() === target.exactName.toLowerCase()
      );

      const fallbackMatch = assets.find((asset) => {
        const lower = asset.name.toLowerCase();
        if (!lower.endsWith(target.extension)) return false;
        if (lower.endsWith('.blockmap')) return false;
        if (target.mustInclude && !lower.includes(target.mustInclude)) return false;
        if (target.mustExclude && lower.includes(target.mustExclude)) return false;
        return true;
      });

      const chosen = exactMatch ?? fallbackMatch;
      if (chosen?.browser_download_url) {
        downloadUrl = chosen.browser_download_url;
      }
    }
  } catch {
    // Fallback cleanly to deterministic /releases/latest/download/<exactName>
  }

  return NextResponse.redirect(downloadUrl, {
    status: 302,
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
