import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

export type WorkflowNodeData = {
  label: string;
  category: string;
  description?: string;
  customCode?: string;
  customPrompt?: string;
  llmEndpoint?: string;
  [key: string]: any;
};

export type WorkflowNode = Node<WorkflowNodeData>;

export type Credential = {
  id: string;
  name: string;
  type: string; // 'api_key', 'oauth2', 'basic_auth'
  data: any; // the actual secret values
};

export type WorkflowState = {
  workflowId: string;
  nodes: WorkflowNode[];
  edges: Edge[];
  credentials: Credential[];
  onNodesChange: OnNodesChange<WorkflowNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: WorkflowNode) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  clearCanvas: () => void;
  addCredential: (cred: Credential) => void;
  removeCredential: (id: string) => void;
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflowId: `wf_${Math.random().toString(36).substr(2, 9)}`,
  nodes: [],
  edges: [],
  credentials: [],
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  addNode: (node: WorkflowNode) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
    });
  },
  clearCanvas: () => {
    set({ nodes: [], edges: [] });
  },
  addCredential: (cred: Credential) => {
    set({ credentials: [...get().credentials, cred] });
  },
  removeCredential: (id: string) => {
    set({ credentials: get().credentials.filter(c => c.id !== id) });
  },
}));
