const fs = require('fs');
const path = 'r:/complete-website-plus-pos-code/foodefy-code/prisma/schema.prisma';
let text = fs.readFileSync(path, 'utf8');

const target = \
    payment_method  String?                  @db.VarChar(255)
    notes           String?                  @db.Text
    created_by      BigInt                   @db.UnsignedBigInt\;

const replacement = \
    payment_method  String?                  @db.VarChar(255)
    notes           String?                  @db.Text
    purchase_status String?                  @default("received") @db.VarChar(50)
    purchase_date   DateTime?                @db.Date
    pay_term        String?                  @db.VarChar(50)
    attach_document String?                  @db.VarChar(255)
    created_by      BigInt                   @db.UnsignedBigInt\;

if (text.includes(target.trim())) {
    text = text.replace(target.trim(), replacement.trim());
    fs.writeFileSync(path, text);
    console.log("Updated schema.prisma with new purchase fields");
} else {
    console.log("Target not found in schema.prisma");
}
