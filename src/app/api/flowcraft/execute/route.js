import { NextResponse } from 'next/server';
import { ExecutionEngine } from '@/lib/flowcraft/ExecutionEngine';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const { workflowId, payload, nodes, edges } = body;

    let targetNodes = nodes;
    let targetEdges = edges;

    // If workflowId is provided, fetch it from DB
    if (workflowId) {
      const workflow = await prisma.flowcraft_workflows.findUnique({
        where: { id: workflowId }
      });
      
      if (!workflow) {
        return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
      }

      const graph = typeof workflow.json_data === 'string' 
          ? JSON.parse(workflow.json_data) 
          : workflow.json_data;

      targetNodes = graph.nodes;
      targetEdges = graph.edges;
    }

    if (!targetNodes || !Array.isArray(targetNodes)) {
      return NextResponse.json({ error: 'Invalid workflow graph' }, { status: 400 });
    }

    // Initialize Engine
    const engine = new ExecutionEngine(targetNodes, targetEdges || [], payload || {});

    // Execute Workflow
    const result = await engine.execute();

    // Log Execution to Database
    if (workflowId) {
      await prisma.flowcraft_executions.create({
        data: {
          workflow_id: workflowId,
          status: result.status,
          logs: JSON.stringify(result.logs)
        }
      });
    }

    return NextResponse.json({
      status: 1,
      executionResult: result
    });

  } catch (error) {
    console.error("Workflow Execution Error:", error);
    return NextResponse.json(
      { status: 0, error: error.message },
      { status: 500 }
    );
  }
}
