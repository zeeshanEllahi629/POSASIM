import os

filepath = 'prisma/schema.prisma'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = '  fa_secret       String?     @map("2fa_secret") @db.VarChar(255)\n  purchases       purchases[]\n}'
replacement = '  fa_secret       String?     @map("2fa_secret") @db.VarChar(255)\n  is_approved     Int         @default(0)\n  approval_token  String?     @db.VarChar(255)\n  purchases       purchases[]\n}'

content = content.replace(target, replacement)

if 'model driver_payments' not in content:
    content += '\n\nmodel driver_payments {\n  id          BigInt    @id @default(autoincrement()) @db.UnsignedBigInt\n  driver_id   BigInt    @db.UnsignedBigInt\n  amount      Decimal   @db.Decimal(10, 2)\n  paid_at     DateTime  @default(now()) @db.Timestamp(0)\n  notes       String?   @db.Text\n  created_by  BigInt    @db.UnsignedBigInt\n}\n'

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated schema successfully.")
