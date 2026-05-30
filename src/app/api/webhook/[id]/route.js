import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { WorkflowEngine } from '@/lib/workflow/executionEngine';

async function handleWebhook(req, { params }) {
  try {
    const { id } = params;
    const method = req.method;

    // Read workflow data
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'workflows.json');
    let workflows = {};
    
    try {
      const fileData = await fs.readFile(filePath, 'utf-8');
      workflows = JSON.parse(fileData);
    } catch {
      return NextResponse.json({ error: "No workflows found" }, { status: 404 });
    }

    const workflow = workflows[id];
    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    // Check if workflow has a Webhook Trigger node
    const webhookNode = workflow.nodes.find(n => n.type === 'webhookTrigger');
    if (!webhookNode) {
      return NextResponse.json({ error: "Workflow does not have a webhook trigger" }, { status: 400 });
    }

    // Check allowed method
    const allowedMethod = webhookNode.data.webhookMethod || 'POST';
    if (allowedMethod !== 'ANY' && allowedMethod !== method) {
      return NextResponse.json({ error: `Method ${method} not allowed` }, { status: 405 });
    }

    // Extract payload
    let body = {};
    if (method !== 'GET') {
      try { body = await req.json(); } catch { /* ignore */ }
    }
    
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams.entries());

    const initialPayload = {
      webhook: {
        body,
        query,
        method
      }
    };

    // Run Engine
    const engine = new WorkflowEngine(workflow.nodes, workflow.edges);
    const result = await engine.execute(initialPayload);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: "Webhook processed and workflow executed successfully",
        data: result.payload
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: "Workflow execution failed", 
        details: result.error 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const GET = handleWebhook;
export const POST = handleWebhook;
export const PUT = handleWebhook;
export const DELETE = handleWebhook;
export const PATCH = handleWebhook;
