import os

def replace_in_file(filepath, old, new):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if old in content:
        content = content.replace(old, new)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {filepath}")
    else:
        print(f"Target string not found in {filepath}")

# pos/page.js
replace_in_file('src/app/admin/pos/page.js',
    '            )}\n          </div>\n        </section>',
    '            )}\n            </div>\n          </div>\n        </section>')

# pos_old/page.js
replace_in_file('src/app/admin/pos_old/page.js',
    '            </button>\n          </div>\n        </div>\n\n        <div className="flex items-center gap-3">',
    '            </button>\n          </div>\n\n        <div className="flex items-center gap-3">')

replace_in_file('src/app/admin/pos_old/page.js',
    '            )}\n          </div>\n        </section>',
    '            )}\n            </div>\n          </div>\n        </section>')

def remove_admin_layout(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('import AdminLayout from "@/components/admin/AdminLayout";\n', '')
    content = content.replace('<AdminLayout>\n', '<>\n')
    content = content.replace('</AdminLayout>\n', '</>\n')
    content = content.replace('<AdminLayout>', '<>')
    content = content.replace('</AdminLayout>', '</>')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Removed AdminLayout from {filepath}")

remove_admin_layout('src/app/admin/approvals/page.js')
remove_admin_layout('src/app/admin/driver-accounts/page.js')

print("All done!")
