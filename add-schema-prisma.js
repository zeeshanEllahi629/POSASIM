const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

const sourcingModels = `
model SourcingProduct {
  id              Int      @id @default(autoincrement())
  productId       BigInt?  @db.UnsignedBigInt
  sourceUrl       String   @db.Text
  sourceType      String   @db.VarChar(50)
  agentUrl        String?  @db.Text
  preferredAgent  String?  @db.VarChar(50)
  sourceName      String   @db.VarChar(255)
  sourceImages    Json?
  sourcePriceRmb  Decimal? @db.Decimal(10, 2)
  sourceVariants  Json?
  supplierInfo    Json?
  sellingPrice    Decimal? @db.Decimal(10, 2)
  margin          Decimal? @db.Decimal(5, 2)
  notes           String?  @db.Text
  status          String   @default("draft") @db.VarChar(50)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  product         item? @relation(fields: [productId], references: [id])
  purchaseOrders  PurchaseOrder[]
}

model SourcingAgent {
  id          Int      @id @default(autoincrement())
  name        String   @unique @db.VarChar(50)
  displayName String   @db.VarChar(100)
  websiteUrl  String   @db.VarChar(255)
  loginUrl    String   @db.VarChar(255)
  isActive    Boolean  @default(true)
  notes       String?  @db.Text
}

model PurchaseOrder {
  id                Int      @id @default(autoincrement())
  sourcingProductId Int
  orderId           BigInt   @db.UnsignedBigInt
  agentName         String   @db.VarChar(50)
  agentOrderId      String?  @db.VarChar(100)
  agentOrderUrl     String?  @db.Text
  quantity          Int      @default(1)
  unitCostRmb       Decimal? @db.Decimal(10, 2)
  totalCostRmb      Decimal? @db.Decimal(10, 2)
  shippingCost      Decimal? @db.Decimal(10, 2)
  status            String   @default("pending") @db.VarChar(50)
  agentNotes        String?  @db.Text
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  sourcingProduct   SourcingProduct @relation(fields: [sourcingProductId], references: [id])
  order             order           @relation(fields: [orderId], references: [id])
  shipment          Shipment?
}

model Shipment {
  id              Int      @id @default(autoincrement())
  purchaseOrderId Int      @unique
  trackingNumber  String   @db.VarChar(100)
  carrier         String?  @db.VarChar(50)
  trackingStatus  String   @default("pending") @db.VarChar(50)
  transitStatus   String?  @db.VarChar(50)
  lastEvent       String?  @db.Text
  lastEventTime   DateTime?
  estimatedDeli   DateTime?
  shippedAt       DateTime?
  deliveredAt     DateTime?
  track17Id       String?  @db.VarChar(100)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  purchaseOrder   PurchaseOrder @relation(fields: [purchaseOrderId], references: [id])
}
`;

schema = schema.replace(
  /model item \{([\s\S]*?)\}/, 
  (match, p1) => `model item {${p1}  sourcingProducts SourcingProduct[]\n}`
);

schema = schema.replace(
  /model order \{([\s\S]*?)\}/, 
  (match, p1) => `model order {${p1}  purchaseOrders PurchaseOrder[]\n}`
);

schema += sourcingModels;

fs.writeFileSync('prisma/schema.prisma', schema);
console.log("Schema updated");
