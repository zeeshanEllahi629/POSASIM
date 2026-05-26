import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const { id, nodes, edges } = await req.json();
    
    // Ensure the data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir);
    }

    // Save workflows to workflows.json
    const filePath = path.join(dataDir, 'workflows.json');
    let workflows = {};
    
    try {
      const fileData = await fs.readFile(filePath, 'utf-8');
      workflows = JSON.parse(fileData);
    } catch {
      // file doesn't exist or is invalid
    }

    workflows[id] = { nodes, edges, updatedAt: new Date().toISOString() };
    
    await fs.writeFile(filePath, JSON.stringify(workflows, null, 2));

    return NextResponse.json({ status: 1, message: 'Workflow saved successfully' });
  } catch (error) {
    console.error("Save Workflow Error:", error);
    return NextResponse.json({ status: 0, message: 'Failed to save workflow', error: error.message }, { status: 500 });
  }
}
