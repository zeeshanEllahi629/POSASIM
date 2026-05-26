const fs = require('fs');
const path = 'r:/complete-website-plus-pos-code/foodefy-code/prisma/schema.prisma';
let schema = fs.readFileSync(path, 'utf8');

// 1. Add new models at the end
const newModels = \
model permissions {
  id         BigInt    @id @default(autoincrement()) @db.UnsignedBigInt
  name       String    @db.VarChar(255)
  guard_name String    @db.VarChar(255)
  created_at DateTime? @db.Timestamp(0)
  updated_at DateTime? @db.Timestamp(0)
}

model role_has_permissions {
  permission_id BigInt @db.UnsignedBigInt
  role_id       BigInt @db.UnsignedBigInt

  @@id([permission_id, role_id])
}

model brands {
  id          Int       @id @default(autoincrement()) @db.UnsignedInt
  name        String    @db.VarChar(255)
  description String?   @db.Text
  status      Int       @default(1)
  created_at  DateTime? @db.Timestamp(0)
  updated_at  DateTime? @db.Timestamp(0)
}

model units {
  id            Int       @id @default(autoincrement()) @db.UnsignedInt
  name          String    @db.VarChar(255)
  short_name    String    @db.VarChar(50)
  allow_decimal Int       @default(0)
  created_at    DateTime? @db.Timestamp(0)
  updated_at    DateTime? @db.Timestamp(0)
}

model warranties {
  id            Int       @id @default(autoincrement()) @db.UnsignedInt
  name          String    @db.VarChar(255)
  description   String?   @db.Text
  duration      Int
  duration_type String    @db.VarChar(20)
  created_at    DateTime? @db.Timestamp(0)
  updated_at    DateTime? @db.Timestamp(0)
}
\;

if (!schema.includes('model permissions {')) {
  schema += '\\n' + newModels;
}

// 2. Update item model
const itemTarget = \
    item_name           String    @db.VarChar(255)
    slug                String    @db.VarChar(255)
    image               String?   @db.VarChar(255)\;

const itemReplacement = \
    item_name           String    @db.VarChar(255)
    slug                String    @db.VarChar(255)
    sku                 String?   @db.VarChar(100)
    brand_id            Int?      @db.UnsignedInt
    unit_id             Int?      @db.UnsignedInt
    warranty_id         Int?      @db.UnsignedInt
    branch_id           Int?      @db.UnsignedInt
    alert_quantity      Int?      @default(0)
    barcode_type        String?   @default("C128") @db.VarChar(50)
    enable_description  Int?      @default(1)
    tax_type            String?   @default("inclusive") @db.VarChar(20)
    product_type        String?   @default("single") @db.VarChar(20)
    label_print         Int?      @default(1)
    image               String?   @db.VarChar(255)\;

if (schema.includes(itemTarget.trim())) {
  schema = schema.replace(itemTarget.trim(), itemReplacement.trim());
}

// 3. Update order model (Add Sales features)
const orderTarget = \
    tax_name           String?             @db.VarChar(255)
    grand_total        String              @db.VarChar(255)\;

const orderReplacement = \
    tax_name           String?             @db.VarChar(255)
    grand_total        String              @db.VarChar(255)
    billing_address    String?             @db.Text
    shipping_address   String?             @db.Text
    order_status       String?             @default("final") @db.VarChar(50)
    shipping_status    String?             @default("pending") @db.VarChar(50)
    shipping_charges   String?             @default("0.00") @db.VarChar(50)
    delivered_to       String?             @db.VarChar(255)
    delivery_person_id BigInt?             @db.UnsignedBigInt
    payment_method     String?             @db.VarChar(50)
    payment_status     String?             @default("unpaid") @db.VarChar(50)
    payment_account_id Int?
    payment_note       String?             @db.Text
    change_return      String?             @default("0.00") @db.VarChar(50)
    advance_balance    String?             @default("0.00") @db.VarChar(50)
    paid_on            DateTime?           @db.Timestamp(0)
    shipping_docs      String?             @db.VarChar(255)\;

if (schema.includes(orderTarget.trim())) {
  schema = schema.replace(orderTarget.trim(), orderReplacement.trim());
}

fs.writeFileSync(path, schema);
console.log('Schema updated successfully!');
