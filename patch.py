import sys
path = "src/app/api/pos/process-payment/route.js"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

target = '          email: data.customer_email || "",\n'
replacement = target + '''          address: data.customer_address || null,
          postal_code: data.customer_postal_code || null,
          driver_id: data.driver_id ? parseInt(data.driver_id) : null,
'''
if target in content:
    content = content.replace(target, replacement)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Patched process-payment successfully")
else:
    print("Target not found")
