const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'prisma/schema.prisma');
let c = fs.readFileSync(file, 'utf8');
c = c.replace(
  'fa_secret       String?     @map("2fa_secret") @db.VarChar(255)\n  purchases       purchases[]\n}',
  'fa_secret       String?     @map("2fa_secret") @db.VarChar(255)\n  is_approved     Int         @default(0)\n  approval_token  String?     @db.VarChar(255)\n  purchases       purchases[]\n}'
);
if (!c.includes('model driver_payments')) {
  c += '\n\nmodel driver_payments {\n  id          BigInt    @id @default(autoincrement()) @db.UnsignedBigInt\n  driver_id   BigInt    @db.UnsignedBigInt\n  amount      Decimal   @db.Decimal(10, 2)\n  paid_at     DateTime  @default(now()) @db.Timestamp(0)\n  notes       String?   @db.Text\n  created_by  BigInt    @db.UnsignedBigInt\n}\n';
}
fs.writeFileSync(file, c);
console.log("Updated schema");
