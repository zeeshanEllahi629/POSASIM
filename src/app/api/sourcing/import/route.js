import { NextResponse } from 'next/server';
import { sourcingService } from '@/services/SourcingService';

export async function POST(req) {
  try {
    const body = await req.json();
    const { url, preferredAgent } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const sourceType = sourcingService.detectSourceType(url);
    const productInfo = await sourcingService.fetchProductInfo(url);
    
    // Construct URLs for all agents
    const agentUrls = {
      superbuy: sourcingService.buildAgentUrl(url, 'superbuy'),
      cssbuy: sourcingService.buildAgentUrl(url, 'cssbuy'),
      sugargoo: sourcingService.buildAgentUrl(url, 'sugargoo'),
      basetao: sourcingService.buildAgentUrl(url, 'basetao'),
      yoybuy: sourcingService.buildAgentUrl(url, 'yoybuy'),
      bhiner: sourcingService.buildAgentUrl(url, 'bhiner')
    };

    return NextResponse.json({
      success: true,
      sourceType,
      productInfo,
      agentUrls
    }, { status: 200 });

  } catch (error) {
    console.error('Import Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
