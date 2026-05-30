export const NodeCategories = [
  { id: "triggers", label: "Triggers", icon: "fa-bolt", color: "#f39c12" },
  { id: "logic", label: "Logic & Flow", icon: "fa-code-branch", color: "#9b59b6" },
  { id: "data", label: "Data Transformation", icon: "fa-database", color: "#3498db" },
  { id: "integrations", label: "Integrations", icon: "fa-plug", color: "#e74c3c" },
  { id: "ai", label: "AI & Agents", icon: "fa-robot", color: "#2ecc71" },
  { id: "subnodes", label: "Configuration Sub-Nodes", icon: "fa-puzzle-piece", color: "#7f8c8d" }
];

export const NodeRegistry = {
  // ============================================
  // TRIGGERS
  // ============================================
  "webhook": {
    id: "webhook",
    name: "Webhook Node",
    description: "Triggers the workflow when a webhook is received.",
    category: "triggers",
    inputs: [],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "method", label: "HTTP Method", type: "select", options: ["GET", "POST", "PUT", "DELETE"], default: "POST" },
      { id: "path", label: "Custom URL Path", type: "text", default: "/webhook/my-flow" },
      { id: "auth", label: "Authentication", type: "select", options: ["None", "Basic Auth", "Bearer Token"], default: "None" }
    ],
    uiSettings: { icon: "fa-bolt", color: "#f39c12" },
    executionLogic: "trigger_webhook",
    validationRules: [{ field: "path", required: true }]
  },
  "schedule": {
    id: "schedule",
    name: "Schedule Trigger",
    description: "Triggers the workflow on a schedule or cron job.",
    category: "triggers",
    inputs: [],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "frequency", label: "Frequency", type: "select", options: ["Every Minute", "Hourly", "Daily", "Weekly", "Cron Expression"], default: "Hourly" },
      { id: "cron", label: "Cron Expression", type: "text", default: "* * * * *" }
    ],
    uiSettings: { icon: "fa-clock", color: "#f39c12" },
    executionLogic: "trigger_schedule",
    validationRules: []
  },
  "manual_trigger": {
    id: "manual_trigger",
    name: "Manual Chat Trigger",
    description: "Triggers workflow from a manual chat message (Root node).",
    category: "triggers",
    inputs: [],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "expected_input", label: "Expected Input Schema", type: "json", default: "{ \"message\": \"string\" }" }
    ],
    uiSettings: { icon: "fa-comment-dots", color: "#f39c12" },
    executionLogic: "trigger_manual",
    validationRules: []
  },

  // ============================================
  // LOGIC & FLOW
  // ============================================
  "if_condition": {
    id: "if_condition",
    name: "IF Node",
    description: "Splits the flow based on True/False conditions.",
    category: "logic",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [
      { id: "true", label: "True", type: "flow" },
      { id: "false", label: "False", type: "flow" }
    ],
    parameters: [
      { id: "field1", label: "Value 1", type: "text", default: "{{json.data}}" },
      { id: "operator", label: "Operator", type: "select", options: ["Equals", "Not Equals", "Contains", "Greater Than", "Less Than", "Exists"], default: "Equals" },
      { id: "field2", label: "Value 2", type: "text", default: "" }
    ],
    uiSettings: { icon: "fa-code-branch", color: "#9b59b6" },
    executionLogic: "logic_if",
    validationRules: [{ field: "field1", required: true }]
  },
  "switch": {
    id: "switch",
    name: "Switch Node",
    description: "Routes data based on multiple cases.",
    category: "logic",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [
      { id: "route1", label: "Route 1", type: "flow" },
      { id: "route2", label: "Route 2", type: "flow" },
      { id: "route3", label: "Route 3", type: "flow" },
      { id: "default", label: "Default", type: "flow" }
    ],
    parameters: [
      { id: "switch_value", label: "Value to check", type: "text", default: "{{json.status}}" },
      { id: "case1", label: "Case 1 Value", type: "text", default: "success" },
      { id: "case2", label: "Case 2 Value", type: "text", default: "pending" },
      { id: "case3", label: "Case 3 Value", type: "text", default: "failed" }
    ],
    uiSettings: { icon: "fa-random", color: "#9b59b6" },
    executionLogic: "logic_switch",
    validationRules: []
  },
  "merge": {
    id: "merge",
    name: "Merge Node",
    description: "Combines or appends data from multiple branches.",
    category: "logic",
    inputs: [
      { id: "in1", label: "Input 1", type: "flow" },
      { id: "in2", label: "Input 2", type: "flow" }
    ],
    outputs: [{ id: "out", label: "Merged", type: "flow" }],
    parameters: [
      { id: "merge_mode", label: "Merge Mode", type: "select", options: ["Append", "Merge by Key", "Keep Input 1", "Keep Input 2"], default: "Append" }
    ],
    uiSettings: { icon: "fa-code-merge", color: "#9b59b6" },
    executionLogic: "logic_merge",
    validationRules: []
  },
  "wait": {
    id: "wait",
    name: "Wait Node",
    description: "Pauses execution for a specified duration.",
    category: "logic",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "duration", label: "Duration", type: "number", default: 1 },
      { id: "unit", label: "Unit", type: "select", options: ["Seconds", "Minutes", "Hours", "Days"], default: "Minutes" }
    ],
    uiSettings: { icon: "fa-hourglass-half", color: "#9b59b6" },
    executionLogic: "logic_wait",
    validationRules: []
  },
  "split_in_batches": {
    id: "split_in_batches",
    name: "Split In Batches",
    description: "Processes large arrays of items in smaller batches.",
    category: "logic",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [
      { id: "batch", label: "Batch", type: "flow" },
      { id: "done", label: "Done", type: "flow" }
    ],
    parameters: [
      { id: "batch_size", label: "Batch Size", type: "number", default: 10 }
    ],
    uiSettings: { icon: "fa-layer-group", color: "#9b59b6" },
    executionLogic: "logic_split_batches",
    validationRules: []
  },
  "execute_workflow": {
    id: "execute_workflow",
    name: "Execute Workflow",
    description: "Triggers a sub-workflow and waits for its completion.",
    category: "logic",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "source", label: "Source", type: "select", options: ["Database", "URL"], default: "Database" },
      { id: "workflow_id", label: "Workflow ID", type: "text", default: "" },
      { id: "mode", label: "Mode", type: "select", options: ["Run once with all items", "Run per item"], default: "Run once with all items" },
      { id: "wait_for_completion", label: "Wait For Sub-Workflow Completion", type: "boolean", default: true }
    ],
    uiSettings: { icon: "fa-project-diagram", color: "#9b59b6" },
    executionLogic: "logic_execute_workflow",
    validationRules: [{ field: "workflow_id", required: true }]
  },

  // ============================================
  // DATA TRANSFORMATION
  // ============================================
  "set": {
    id: "set",
    name: "Set Node",
    description: "Creates, edits, or removes fields in the JSON payload.",
    category: "data",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "mode", label: "Mode", type: "select", options: ["Keep Only Set Fields", "Add to Existing Fields"], default: "Add to Existing Fields" },
      { id: "field_name", label: "Field Name", type: "text", default: "myField" },
      { id: "field_value", label: "Field Value", type: "text", default: "myValue" }
    ],
    uiSettings: { icon: "fa-pen-square", color: "#3498db" },
    executionLogic: "data_set",
    validationRules: []
  },
  "code": {
    id: "code",
    name: "Code Node",
    description: "Executes custom JavaScript or Python logic on the data.",
    category: "data",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "language", label: "Language", type: "select", options: ["JavaScript", "Python"], default: "JavaScript" },
      { id: "code", label: "Code", type: "code", default: "for (const item of $input.all()) {\n  item.json.myNewField = 1;\n}\nreturn $input.all();" }
    ],
    uiSettings: { icon: "fa-code", color: "#3498db" },
    executionLogic: "data_code",
    validationRules: []
  },
  "edit_fields": {
    id: "edit_fields",
    name: "Edit Fields",
    description: "Visually map and transform fields.",
    category: "data",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "mapping", label: "Field Mapping", type: "json", default: "{}" }
    ],
    uiSettings: { icon: "fa-edit", color: "#3498db" },
    executionLogic: "data_edit_fields",
    validationRules: []
  },
  "date_time": {
    id: "date_time",
    name: "Date & Time Node",
    description: "Format, calculate or extract parts from dates.",
    category: "data",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "action", label: "Action", type: "select", options: ["Format Date", "Calculate Time Difference", "Get Current Date"], default: "Format Date" },
      { id: "format", label: "Format String", type: "text", default: "YYYY-MM-DD HH:mm:ss" }
    ],
    uiSettings: { icon: "fa-calendar-alt", color: "#3498db" },
    executionLogic: "data_date_time",
    validationRules: []
  },
  "csv": {
    id: "csv",
    name: "CSV Node",
    description: "Parse CSV to JSON or convert JSON to CSV.",
    category: "data",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "operation", label: "Operation", type: "select", options: ["JSON to CSV", "CSV to JSON"], default: "CSV to JSON" }
    ],
    uiSettings: { icon: "fa-file-csv", color: "#3498db" },
    executionLogic: "data_csv",
    validationRules: []
  },
  "html": {
    id: "html",
    name: "HTML Node",
    description: "Extract data from HTML pages using CSS selectors.",
    category: "data",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "html_property", label: "HTML Property", type: "text", default: "data" },
      { id: "css_selector", label: "CSS Selector", type: "text", default: "h1" }
    ],
    uiSettings: { icon: "fa-file-code", color: "#3498db" },
    executionLogic: "data_html",
    validationRules: []
  },
  "xml": {
    id: "xml",
    name: "XML Node",
    description: "Convert XML to JSON or JSON to XML.",
    category: "data",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "operation", label: "Operation", type: "select", options: ["XML to JSON", "JSON to XML"], default: "XML to JSON" }
    ],
    uiSettings: { icon: "fa-file-alt", color: "#3498db" },
    executionLogic: "data_xml",
    validationRules: []
  },
  "rss": {
    id: "rss",
    name: "RSS Feed",
    description: "Read data from RSS feeds.",
    category: "data",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "url", label: "RSS Feed URL", type: "text", default: "https://news.ycombinator.com/rss" }
    ],
    uiSettings: { icon: "fa-rss-square", color: "#3498db" },
    executionLogic: "data_rss",
    validationRules: [{ field: "url", required: true }]
  },

  // ============================================
  // INTEGRATIONS
  // ============================================
  "http_request": {
    id: "http_request",
    name: "HTTP Request",
    description: "Make HTTP requests to external APIs.",
    category: "integrations",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "method", label: "Method", type: "select", options: ["GET", "POST", "PUT", "DELETE", "PATCH"], default: "GET" },
      { id: "url", label: "URL", type: "text", default: "https://api.example.com/data" },
      { id: "authentication", label: "Authentication", type: "select", options: ["None", "Basic Auth", "Bearer Token", "Header Auth"], default: "None" },
      { id: "headers", label: "Headers (JSON)", type: "json", default: "{}" },
      { id: "body", label: "Body (JSON)", type: "json", default: "{}" }
    ],
    uiSettings: { icon: "fa-exchange-alt", color: "#e74c3c" },
    executionLogic: "integration_http",
    validationRules: [{ field: "url", required: true }]
  },
  "google_sheets": {
    id: "google_sheets",
    name: "Google Sheets",
    description: "Read, Append, or Update rows in Google Sheets.",
    category: "integrations",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "credential", label: "Google Credential", type: "credential", credentialType: "google" },
      { id: "operation", label: "Operation", type: "select", options: ["Read Row", "Append Row", "Update Row"], default: "Append Row" },
      { id: "spreadsheet_id", label: "Spreadsheet ID", type: "text", default: "" },
      { id: "range", label: "Sheet Range", type: "text", default: "Sheet1!A:Z" }
    ],
    uiSettings: { icon: "fa-table", color: "#0f9d58" }, // Google Green
    executionLogic: "integration_gsheets",
    validationRules: [{ field: "spreadsheet_id", required: true }]
  },
  "gmail": {
    id: "gmail",
    name: "Gmail",
    description: "Send or Read emails via Gmail.",
    category: "integrations",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "credential", label: "Google Credential", type: "credential", credentialType: "google" },
      { id: "operation", label: "Operation", type: "select", options: ["Send Email", "Read Emails"], default: "Send Email" },
      { id: "to", label: "To", type: "text", default: "" },
      { id: "subject", label: "Subject", type: "text", default: "" },
      { id: "body", label: "Body", type: "code", default: "" }
    ],
    uiSettings: { icon: "fa-envelope", color: "#ea4335" }, // Google Red
    executionLogic: "integration_gmail",
    validationRules: []
  },
  "google_drive": {
    id: "google_drive",
    name: "Google Drive",
    description: "Upload, Download or List files in Google Drive.",
    category: "integrations",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "credential", label: "Google Credential", type: "credential", credentialType: "google" },
      { id: "operation", label: "Operation", type: "select", options: ["Upload File", "Download File", "List Files"], default: "Upload File" }
    ],
    uiSettings: { icon: "fa-hdd", color: "#4285f4" }, 
    executionLogic: "integration_gdrive",
    validationRules: []
  },
  "google_calendar": {
    id: "google_calendar",
    name: "Google Calendar",
    description: "Create or Read calendar events.",
    category: "integrations",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "credential", label: "Google Credential", type: "credential", credentialType: "google" },
      { id: "operation", label: "Operation", type: "select", options: ["Create Event", "Get Events"], default: "Create Event" }
    ],
    uiSettings: { icon: "fa-calendar", color: "#4285f4" },
    executionLogic: "integration_gcalendar",
    validationRules: []
  },
  "database": {
    id: "database",
    name: "Database Node",
    description: "Execute SQL queries directly (MySQL/PostgreSQL).",
    category: "integrations",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "credential", label: "Database Credential", type: "credential", credentialType: "database" },
      { id: "query", label: "SQL Query", type: "code", default: "SELECT * FROM users LIMIT 10;" }
    ],
    uiSettings: { icon: "fa-database", color: "#e74c3c" },
    executionLogic: "integration_database",
    validationRules: [{ field: "query", required: true }]
  },
  "slack": {
    id: "slack",
    name: "Slack",
    description: "Send messages to Slack channels.",
    category: "integrations",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "credential", label: "Slack Token", type: "credential", credentialType: "slack" },
      { id: "channel", label: "Channel ID", type: "text", default: "" },
      { id: "text", label: "Message Text", type: "text", default: "Hello from FlowCraft!" }
    ],
    uiSettings: { icon: "fa-slack", color: "#4A154B" },
    executionLogic: "integration_slack",
    validationRules: []
  },
  "telegram": {
    id: "telegram",
    name: "Telegram",
    description: "Send messages via Telegram Bot.",
    category: "integrations",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "credential", label: "Bot Token", type: "credential", credentialType: "telegram" },
      { id: "chat_id", label: "Chat ID", type: "text", default: "" },
      { id: "text", label: "Message", type: "text", default: "" }
    ],
    uiSettings: { icon: "fa-telegram", color: "#0088cc" },
    executionLogic: "integration_telegram",
    validationRules: []
  },
  "whatsapp": {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Send messages via WhatsApp API.",
    category: "integrations",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "credential", label: "WhatsApp Token", type: "credential", credentialType: "whatsapp" },
      { id: "phone", label: "Phone Number", type: "text", default: "" },
      { id: "template", label: "Template / Message", type: "text", default: "" }
    ],
    uiSettings: { icon: "fa-whatsapp", color: "#25D366" },
    executionLogic: "integration_whatsapp",
    validationRules: []
  },
  "airtable": {
    id: "airtable",
    name: "Airtable",
    description: "Create or read records from Airtable bases.",
    category: "integrations",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "credential", label: "Airtable PAT", type: "credential", credentialType: "airtable" },
      { id: "base_id", label: "Base ID", type: "text", default: "" },
      { id: "table", label: "Table Name", type: "text", default: "" }
    ],
    uiSettings: { icon: "fa-table", color: "#18BFFF" },
    executionLogic: "integration_airtable",
    validationRules: []
  },
  "notion": {
    id: "notion",
    name: "Notion",
    description: "Interact with Notion pages and databases.",
    category: "integrations",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "credential", label: "Notion Token", type: "credential", credentialType: "notion" },
      { id: "operation", label: "Operation", type: "select", options: ["Create Page", "Read Database"], default: "Read Database" },
      { id: "db_id", label: "Database ID", type: "text", default: "" }
    ],
    uiSettings: { icon: "fa-file", color: "#000000" },
    executionLogic: "integration_notion",
    validationRules: []
  },
  "shopify": {
    id: "shopify",
    name: "Shopify",
    description: "Manage Shopify store data.",
    category: "integrations",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "credential", label: "Shopify Token", type: "credential", credentialType: "shopify" },
      { id: "resource", label: "Resource", type: "select", options: ["Orders", "Products", "Customers"], default: "Orders" }
    ],
    uiSettings: { icon: "fa-shopping-bag", color: "#95BF47" },
    executionLogic: "integration_shopify",
    validationRules: []
  },
  "stripe": {
    id: "stripe",
    name: "Stripe",
    description: "Interact with Stripe payments.",
    category: "integrations",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "credential", label: "Stripe API Key", type: "credential", credentialType: "stripe" },
      { id: "operation", label: "Operation", type: "select", options: ["Create Customer", "Create Charge", "List Charges"], default: "List Charges" }
    ],
    uiSettings: { icon: "fa-credit-card", color: "#6772E5" },
    executionLogic: "integration_stripe",
    validationRules: []
  },
  "redis": {
    id: "redis",
    name: "Redis",
    description: "Get, Set or Delete keys in Redis.",
    category: "integrations",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "credential", label: "Redis URL", type: "credential", credentialType: "redis" },
      { id: "operation", label: "Operation", type: "select", options: ["GET", "SET", "DEL"], default: "GET" },
      { id: "key", label: "Key", type: "text", default: "" },
      { id: "value", label: "Value (if SET)", type: "text", default: "" }
    ],
    uiSettings: { icon: "fa-database", color: "#D82C20" },
    executionLogic: "integration_redis",
    validationRules: []
  },
  "ftp": {
    id: "ftp",
    name: "FTP",
    description: "Upload or Download files via FTP.",
    category: "integrations",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "credential", label: "FTP Connection", type: "credential", credentialType: "ftp" },
      { id: "operation", label: "Operation", type: "select", options: ["Upload", "Download"], default: "Upload" },
      { id: "path", label: "Remote Path", type: "text", default: "/" }
    ],
    uiSettings: { icon: "fa-server", color: "#e74c3c" },
    executionLogic: "integration_ftp",
    validationRules: []
  },
  "execute_command": {
    id: "execute_command",
    name: "Execute Command",
    description: "Execute a shell/terminal command.",
    category: "integrations",
    inputs: [{ id: "in", label: "Input", type: "flow" }],
    outputs: [{ id: "out", label: "Output", type: "flow" }],
    parameters: [
      { id: "command", label: "Command", type: "code", default: "ls -la" }
    ],
    uiSettings: { icon: "fa-terminal", color: "#2c3e50" },
    executionLogic: "integration_shell",
    validationRules: []
  },

  // ============================================
  // AI & AGENTS
  // ============================================
  "agent": {
    id: "agent",
    name: "Agent (Conversational)",
    description: "A custom AI Agent that uses tools and memory.",
    category: "ai",
    inputs: [
      { id: "in", label: "Trigger/Input", type: "flow" }, // Left handle
      { id: "model", label: "Model *", type: "parameter", position: "bottom", multiple: false },
      { id: "memory", label: "Memory", type: "parameter", position: "bottom", multiple: false },
      { id: "tools", label: "Tools", type: "parameter", position: "bottom", multiple: true }
    ],
    outputs: [{ id: "out", label: "Response", type: "flow" }],
    parameters: [
      { id: "system_message", label: "System Message", type: "text", default: "You are a helpful assistant." }
    ],
    uiSettings: { icon: "fa-robot", color: "#2ecc71" },
    executionLogic: "ai_agent_chain",
    validationRules: []
  },
  
  // --------------------------------------------
  // SUB-NODES (For attaching to Agent)
  // --------------------------------------------
  "openai_model": {
    id: "openai_model",
    name: "OpenAI Chat Model",
    description: "OpenAI language model configuration.",
    category: "subnodes",
    inputs: [], // No flow inputs
    outputs: [{ id: "model_out", label: "Model", type: "parameter", position: "top" }],
    parameters: [
      { id: "credential", label: "OpenAI API Key", type: "credential", credentialType: "openai" },
      { id: "model_name", label: "Model Name", type: "select", options: ["gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"], default: "gpt-3.5-turbo" },
      { id: "temperature", label: "Temperature", type: "number", default: 0.7 }
    ],
    uiSettings: { icon: "fa-brain", color: "#2ecc71", variant: "subnode" },
    executionLogic: "ai_model_config",
    validationRules: []
  },
  "buffer_memory": {
    id: "buffer_memory",
    name: "Window Buffer Memory",
    description: "Retains previous chat messages up to a window limit.",
    category: "subnodes",
    inputs: [], 
    outputs: [{ id: "memory_out", label: "Memory", type: "parameter", position: "top" }],
    parameters: [
      { id: "window_size", label: "Window Size (k)", type: "number", default: 5 },
      { id: "session_id", label: "Session ID Key", type: "text", default: "{{json.session_id}}" }
    ],
    uiSettings: { icon: "fa-database", color: "#2ecc71", variant: "subnode" },
    executionLogic: "ai_memory_config",
    validationRules: []
  }
};
