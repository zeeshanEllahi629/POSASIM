const fs = require('fs');
function patchFile(path, search, replace) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(search, replace);
  fs.writeFileSync(path, content);
}

patchFile('src/app/admin/pos/page.js', 
  '            )}\r\n          </div>\r\n        </section>', 
  '            )}\r\n            </div>\r\n          </div>\r\n        </section>'
);

patchFile('src/app/admin/pos/page.js', 
  '            )}\n          </div>\n        </section>', 
  '            )}\n            </div>\n          </div>\n        </section>'
);

patchFile('src/app/admin/pos_old/page.js', 
  '            </button>\r\n          </div>\r\n        </div>\r\n\r\n        <div className="flex items-center gap-3">',
  '            </button>\r\n          </div>\r\n\r\n        <div className="flex items-center gap-3">'
);

patchFile('src/app/admin/pos_old/page.js', 
  '            </button>\n          </div>\n        </div>\n\n        <div className="flex items-center gap-3">',
  '            </button>\n          </div>\n\n        <div className="flex items-center gap-3">'
);

patchFile('src/app/admin/pos_old/page.js', 
  '            )}\r\n          </div>\r\n        </section>',
  '            )}\r\n            </div>\r\n          </div>\r\n        </section>'
);

patchFile('src/app/admin/pos_old/page.js', 
  '            )}\n          </div>\n        </section>',
  '            )}\n            </div>\n          </div>\n        </section>'
);

// AdminLayout removal
function removeAdminLayout(path) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace('import AdminLayout from "@/components/admin/AdminLayout";\n', '');
  content = content.replace('import AdminLayout from "@/components/admin/AdminLayout";\r\n', '');
  content = content.replace('<AdminLayout>\n', '<>\n');
  content = content.replace('<AdminLayout>\r\n', '<>\r\n');
  content = content.replace('</AdminLayout>\n', '</>\n');
  content = content.replace('</AdminLayout>\r\n', '</>\r\n');
  
  content = content.replace('<AdminLayout>', '<>');
  content = content.replace('</AdminLayout>', '</>');
  
  fs.writeFileSync(path, content);
}

removeAdminLayout('src/app/admin/approvals/page.js');
removeAdminLayout('src/app/admin/driver-accounts/page.js');
console.log("Patched successfully");
