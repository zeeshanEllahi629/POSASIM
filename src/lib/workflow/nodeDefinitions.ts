export const NodeCategories = {
  TRIGGERS: "Triggers",
  COMMUNICATION: "Communication",
  DATA: "Data Processing",
  LOGIC: "Logic",
  AI: "AI Models",
  APPS: "App Integrations",
  CUSTOM: "Custom",
  ANNOTATIONS: "Annotations",
};

export const NodeDefinitions = [
  // TRIGGERS (n8n style: usually Pink/Purple for triggers)
  { type: "webhookTrigger", label: "Webhook", category: NodeCategories.TRIGGERS, color: "bg-pink-600", inputs: 0, outputs: 1, description: "Start workflow on webhook call" },
  { type: "scheduleTrigger", label: "Schedule", category: NodeCategories.TRIGGERS, color: "bg-pink-600", inputs: 0, outputs: 1, description: "Trigger workflow at a specific time" },
  { type: "manualTrigger", label: "Manual Trigger", category: NodeCategories.TRIGGERS, color: "bg-pink-600", inputs: 0, outputs: 1, description: "Trigger workflow manually" },

  // DATA PROCESSING (Core actions)
  { type: "httpRequest", label: "HTTP Request", category: NodeCategories.DATA, color: "bg-blue-600", inputs: 1, outputs: 1, description: "Make an HTTP request" },
  { type: "set", label: "Edit Fields (Set)", category: NodeCategories.DATA, color: "bg-gray-600", inputs: 1, outputs: 1, description: "Set or edit data fields" },
  { type: "jsonParser", label: "JSON Parser", category: NodeCategories.DATA, color: "bg-gray-600", inputs: 1, outputs: 1, description: "Parse or stringify JSON" },
  { type: "databaseQuery", label: "Database Query", category: NodeCategories.DATA, color: "bg-blue-500", inputs: 1, outputs: 1, description: "Run an SQL query" },

  // COMMUNICATION
  { type: "sendEmail", label: "Send Email", category: NodeCategories.COMMUNICATION, color: "bg-teal-600", inputs: 1, outputs: 1, description: "Send an email" },
  { type: "slackMessage", label: "Slack", category: NodeCategories.COMMUNICATION, color: "bg-[#4A154B]", inputs: 1, outputs: 1, description: "Send a message to Slack" },

  // LOGIC (n8n style: usually purple/indigo for routing)
  { type: "condition", label: "If", category: NodeCategories.LOGIC, color: "bg-indigo-600", inputs: 1, outputs: 2, description: "Split flow based on a condition" }, // True/False paths
  { type: "switch", label: "Switch", category: NodeCategories.LOGIC, color: "bg-indigo-600", inputs: 1, outputs: 4, description: "Route data based on rules" },
  { type: "merge", label: "Merge", category: NodeCategories.LOGIC, color: "bg-indigo-600", inputs: 2, outputs: 1, description: "Merge multiple streams into one" },
  { type: "delay", label: "Wait (Delay)", category: NodeCategories.LOGIC, color: "bg-gray-600", inputs: 1, outputs: 1, description: "Wait a specific amount of time" },

  // CUSTOM / CODE
  { type: "customCode", label: "Code", category: NodeCategories.CUSTOM, color: "bg-orange-600", inputs: 1, outputs: 1, description: "Write custom JavaScript code" },

  // AI MODELS
  { type: "customChat", label: "AI Chat", category: NodeCategories.AI, color: "bg-[#8256D0]", inputs: 1, outputs: 1, description: "Interact with an LLM chat model." },
  { type: "embeddingGenerator", label: "Embeddings", category: NodeCategories.AI, color: "bg-[#8256D0]", inputs: 1, outputs: 1, description: "Generate vector embeddings." },

  // APP INTEGRATIONS
  { type: "telegramApp", label: "Telegram", category: NodeCategories.APPS, color: "bg-[#2CA5E0]", inputs: 1, outputs: 1, description: "Send messages via Telegram Bot API" },
  { type: "discordApp", label: "Discord", category: NodeCategories.APPS, color: "bg-[#5865F2]", inputs: 1, outputs: 1, description: "Send messages to Discord channels" },
  { type: "aiBrain", label: "AI Brain", category: NodeCategories.AI, color: "bg-[#10A37F]", inputs: 1, outputs: 1, description: "Connect to ANY LLM Provider (OpenAI, Anthropic, Ollama)" },
  { type: "shopifyApp", label: "Shopify", category: NodeCategories.APPS, color: "bg-[#95BF47]", inputs: 1, outputs: 1, description: "Manage Shopify orders and products" },

  // ANNOTATIONS
  { type: "stickyNote", label: "Sticky Note", category: NodeCategories.ANNOTATIONS, color: "bg-yellow-400", inputs: 0, outputs: 0, description: "Add notes to the canvas." }
];
