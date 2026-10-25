const state = {
  clients: [],
  imports: [],
  reconciliation: [],
  validation: [],
  tasks: [],
  rules: [
    {
      id: 'GST-001',
      title: 'GSTIN format and checksum',
      provision: 'Rule 26, Section 25',
      effectiveDate: '2017-07-01',
      category: 'GSTIN validation',
      evidence: 'GSTIN string + status',
      status: 'Active',
      source: 'GST Portal / CBIC',
      lastVerified: '2025-01-01'
    },
    {
      id: 'GST-002',
      title: 'Invoice particulars check',
      provision: 'Section 31 & Rules 46, 53, 54',
      effectiveDate: '2017-07-01',
      category: 'Invoice validation',
      evidence: 'Supplier GSTIN, invoice no, date, taxable value, tax amount',
      status: 'Active',
      source: 'CBIC GST',
      lastVerified: '2025-01-01'
    },
    {
      id: 'GST-003',
      title: 'Section 16 ITC eligibility',
      provision: 'Section 16',
      effectiveDate: '2017-07-01',
      category: 'ITC review',
      evidence: 'Bills, GSTR-2B, payment, return timelines',
      status: 'Active',
      source: 'CGST Act',
      lastVerified: '2025-01-01'
    }
  ]
};

function seedSampleData() {
  state.clients = [
    {
      id: 'C-1001',
      name: 'Metro Traders',
      legalName: 'Metro Traders Private Limited',
      gstin: '27ABCDE1234F1Z5',
      state: 'Maharashtra',
      type: 'Pvt Ltd',
      status: 'Verified',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'C-1002',
      name: 'Rajasthan Fasteners',
      legalName: 'Rajasthan Fasteners',
      gstin: '08LMNOP5678D1Z2',
      state: 'Rajasthan',
      type: 'Proprietorship',
      status: 'Provisional',
      lastUpdated: new Date().toISOString()
    }
  ];

  state.imports = [
    {
      type: 'GST-JSON',
      name: 'gstr2b_may_2024.json',
      gstin: '27ABCDE1234F1Z5',
      period: '2024-05',
      year: '2024-25',
      importedAt: new Date().toISOString(),
      status: 'Imported'
    },
    {
      type: 'Books-CSV',
      name: 'purchase_register_may_2024.csv',
      gstin: '27ABCDE1234F1Z5',
      period: '2024-05',
      year: '2024-25',
      importedAt: new Date().toISOString(),
      status: 'Imported'
    }
  ];

  state.reconciliation = [
    {
      client: 'Metro Traders',
      gstin: '27ABCDE1234F1Z5',
      invoice: 'INV-1001',
      supplier: 'Shree Steel Industries',
      booksAmount: 220000,
      portalAmount: 220000,
      diff: 0,
      status: 'Matched',
      category: 'Exact match',
      review: 'Ready'
    },
    {
      client: 'Metro Traders',
      gstin: '27ABCDE1234F1Z5',
      invoice: 'INV-1018',
      supplier: 'Bharat Components',
      booksAmount: 98500,
      portalAmount: 102400,
      diff: 3900,
      status: 'Matched with Difference',
      category: 'Amount differs',
      review: 'Action required'
    },
    {
      client: 'Metro Traders',
      gstin: '27ABCDE1234F1Z5',
      invoice: 'INV-1042',
      supplier: 'Apex Logistics',
      booksAmount: 125000,
      portalAmount: 0,
      diff: 125000,
      status: 'Missing in Portal',
      category: 'Missing in GSTR-2B',
      review: 'Action required'
    },
    {
      client: 'Metro Traders',
      gstin: '27ABCDE1234F1Z5',
      invoice: 'INV-1135',
      supplier: 'Greenpack Suppliers',
      booksAmount: 0,
      portalAmount: 76000,
      diff: 76000,
      status: 'Missing in Books',
      category: 'Invoice in portal but not in books',
      review: 'Action required'
    }
  ];

  state.tasks = [
    { title: 'Verify supplier GSTIN for invoice INV-1018', client: 'Metro Traders', period: 'May-2024', status: 'Action required' },
    { title: 'Review possible ITC restriction', client: 'Metro Traders', period: 'May-2024', status: 'Awaiting review' },
    { title: 'Prepare GSTR-3B draft', client: 'Metro Traders', period: 'May-2024', status: 'Draft' }
  ];

  state.validation = [
    { invoice: 'INV-1018', issue: 'Taxable value differs by ₹3,900', category: 'Reconciliation difference', status: 'Needs review' },
    { invoice: 'INV-1042', issue: 'Invoice missing from GSTR-2B', category: 'Possible compliance gap', status: 'Needs review' },
    { invoice: 'INV-1135', issue: 'Portal invoice not in books', category: 'Missing in books', status: 'Action required' }
  ];
}

function saveState() {
  localStorage.setItem('gst_practice_state', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('gst_practice_state');
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed);
  } catch (e) {
    console.warn('Could not parse saved state', e);
  }
}

function bindUI() {
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.addEventListener('click', () => openScreen(item.dataset.screen));
  });

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      renderReturnTable(tab.dataset.return);
    });
  });

  document.getElementById('globalSearch').addEventListener('input', () => {
    const q = document.getElementById('globalSearch').value.trim().toLowerCase();
    const rows = document.querySelectorAll('#recoTable tbody tr');
    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = q && !text.includes(q) ? 'none' : '';
    });
  });

  document.getElementById('addClientBtn').addEventListener('click', () => {
    const form = document.getElementById('clientFormGrid');
    form.classList.toggle('hidden');
  });

  document.getElementById('addClientTopBtn').addEventListener('click', () => {
    openScreen('clients');
    document.getElementById('clientFormGrid').classList.remove('hidden');
  });

  document.getElementById('createSampleBtn').addEventListener('click', () => {
    seedSampleData();
    saveState();
    renderAll();
  });

  document.getElementById('viewPendingBtn').addEventListener('click', () => openScreen('reco'));

  document.getElementById('runReconciliationBtn').addEventListener('click', () => runReconciliation());
  document.getElementById('prepareReturnBtn').addEventListener('click', () => {
    const activeReturn = document.querySelector('.tab.active')?.dataset.return || 'gstr1';
    renderReturnTable(activeReturn);
  });
  document.getElementById('runValidationBtn').addEventListener('click', () => runValidation());
  document.getElementById('testAiBtn').addEventListener('click', () => testAiConnection());

  document.getElementById('importGstBtn').addEventListener('click', () => document.getElementById('gstFileInput').click());
  document.getElementById('importBooksBtn').addEventListener('click', () => document.getElementById('booksFileInput').click());

  document.getElementById('gstFileInput').addEventListener('change', (e) => handleBulkImport(e, 'gst'));
  document.getElementById('booksFileInput').addEventListener('change', (e) => handleBulkImport(e, 'books'));

  const gstZone = document.getElementById('gstDropZone');
  gstZone.addEventListener('dragover', (e) => { e.preventDefault(); gstZone.style.borderColor = '#2563eb'; });
  gstZone.addEventListener('dragleave', () => { gstZone.style.borderColor = '#bfd0ff'; });
  gstZone.addEventListener('drop', (e) => {
    e.preventDefault();
    gstZone.style.borderColor = '#bfd0ff';
    handleBulkImport({ target: { files: e.dataTransfer.files } }, 'gst');
  });
  gstZone.addEventListener('click', () => document.getElementById('gstFileInput').click());

  const booksZone = document.getElementById('booksDropZone');
  booksZone.addEventListener('dragover', (e) => { e.preventDefault(); booksZone.style.borderColor = '#2563eb'; });
  booksZone.addEventListener('dragleave', () => { booksZone.style.borderColor = '#bfd0ff'; });
  booksZone.addEventListener('drop', (e) => {
    e.preventDefault();
    booksZone.style.borderColor = '#bfd0ff';
    handleBulkImport({ target: { files: e.dataTransfer.files } }, 'books');
  });
  booksZone.addEventListener('click', () => document.getElementById('booksFileInput').click());

  document.getElementById('addClientBtn').addEventListener('click', () => {
    const client = {
      id: 'C-' + Date.now(),
      name: document.getElementById('clientName').value || 'New Client',
      legalName: document.getElementById('clientLegalName').value || '',
      gstin: document.getElementById('clientGSTIN').value || 'New GSTIN',
      state: document.getElementById('clientState').value || 'TBD',
      type: document.getElementById('clientType').value || 'Proprietorship',
      status: document.getElementById('clientStatus').value || 'Provisional',
      lastUpdated: new Date().toISOString()
    };

    if (client.name && client.gstin) {
      state.clients.push(client);
      saveState();
      renderAll();
      document.getElementById('clientFormGrid').classList.add('hidden');
      document.getElementById('clientName').value = '';
      document.getElementById('clientGSTIN').value = '';
      document.getElementById('clientLegalName').value = '';
      document.getElementById('clientState').value = '';
      document.getElementById('clientType').value = 'Proprietorship';
      document.getElementById('clientStatus').value = 'Provisional';
    }
  });
}

function openScreen(screenName) {
  document.querySelectorAll('.screen').forEach((screen) => {
    screen.classList.toggle('active', screen.id === screenName);
  });

  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.toggle('active', item.dataset.screen === screenName);
  });
}

function renderAll() {
  renderDashboard();
  renderClientTable();
  renderReconciliationTable();
  renderReturnTable(document.querySelector('.tab.active')?.dataset.return || 'gstr1');
  renderValidationTable();
  renderRuleTable();
  renderMappingTable();
  renderLogsTable();
  renderReportSummary();
}

function renderDashboard() {
  document.getElementById('kpiClients').textContent = String(state.clients.length || 0);
  document.getElementById('kpiRegistrations').textContent = String(state.clients.filter((c) => c.gstin).length || 0);
  document.getElementById('kpiPendingReturns').textContent = '3';
  document.getElementById('kpiExceptions').textContent = String(state.validation.length || 0);

  document.getElementById('clientNameSummary').textContent = state.clients[0]?.name || 'Metro Traders';
  document.getElementById('gstinSummary').textContent = state.clients[0]?.gstin || '27ABCDE1234F1Z5';

  const taskList = document.getElementById('taskList');
  taskList.innerHTML = (state.tasks || []).map((task) => `
    <div class="list-item">
      <div>
        <div class="list-item-title">${task.title}</div>
        <div class="mini">${task.client} • ${task.period}</div>
      </div>
      <span class="status-badge ${task.status === 'Awaiting review' ? 'status-review' : task.status === 'Action required' ? 'status-diff' : 'status-matched'}">${task.status}</span>
    </div>
  `).join('');

  const timelineList = document.getElementById('timelineList');
  timelineList.innerHTML = (state.imports || []).map((item) => `
    <div class="list-item">
      <div>
        <div class="list-item-title">${item.name}</div>
        <div class="mini">${item.type} • ${item.period}</div>
      </div>
      <span class="pill">${item.status}</span>
    </div>
  `).join('');
}

function renderClientTable() {
  const wrap = document.getElementById('clientTableWrap');
  wrap.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>GSTIN</th>
            <th>Legal Name</th>
            <th>State</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${(state.clients || []).map((c) => `
            <tr>
              <td>${c.name}</td>
              <td>${c.gstin}</td>
              <td>${c.legalName || '-'}</td>
              <td>${c.state}</td>
              <td><span class="status-badge ${c.status === 'Verified' ? 'status-matched' : c.status === 'Provisional' ? 'status-diff' : 'status-review'}">${c.status}</span></td>
              <td><span class="linkish">Open</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function detectClientFromData(obj) {
  const maybeGSTIN = [
    obj?.gstin,
    obj?.taxpayerGstin,
    obj?.gst_in,
    obj?.GSTIN,
    obj?.header?.gstin,
    obj?.data?.gstin,
    obj?.body?.gstin
  ].find((v) => typeof v === 'string' && /^[0-9A-Z]{15}$/.test(v));
  return maybeGSTIN || '27ABCDE1234F1Z5';
}

function inferPeriod(obj) {
  const candidates = [
    obj?.returnPeriod,
    obj?.period,
    obj?.periodDetails?.period,
    obj?.detail?.period,
    obj?.data?.period,
    obj?.header?.period,
    obj?.period_name
  ];

  for (const v of candidates) {
    if (typeof v === 'string' && /[0-9]{4}-[0-9]{2}|[A-Za-z]{3}-[0-9]{4}/.test(v)) return v;
  }
  return '2024-05';
}

function inferYear(obj) {
  const candidates = [
    obj?.financialYear,
    obj?.year,
    obj?.header?.financialYear,
    obj?.data?.financialYear,
    obj?.fin_year
  ];

  for (const v of candidates) {
    if (typeof v === 'string' && /[0-9]{4}-[0-9]{2}/.test(v)) return v;
  }
  return '2024-25';
}

function handleBulkImport(event, type) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  files.forEach((file) => {
    const ext = (file.name.split('.').pop() || '').toLowerCase();

    if (!['json', 'csv', 'xlsx', 'xls', 'zip'].includes(ext)) {
      state.imports.push({ type: 'Unsupported', name: file.name, status: 'Failed' });
      saveState();
      renderDashboard();
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      let parsed = null;

      try {
        if (ext === 'json') {
          parsed = JSON.parse(reader.result);
        } else if (ext === 'csv') {
          parsed = parseCsvToObjects(reader.result);
        } else if (['xlsx', 'xls'].includes(ext)) {
          const workbook = XLSX.read(reader.result, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          parsed = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        } else if (ext === 'zip') {
          parsed = { zip: file.name, note: 'ZIP detected in browser; zip extraction not fully handled without extra unzip logic.' };
        }
      } catch (e) {
        parsed = { error: e.message };
      }

      const gstin = detectClientFromData(parsed || {});
      state.imports.push({
        type: type === 'gst' ? 'GST file' : 'Books file',
        name: file.name,
        gstin,
        period: inferPeriod(parsed || {}),
        year: inferYear(parsed || {}),
        importedAt: new Date().toISOString(),
        status: 'Imported'
      });

      if (type === 'books') {
        state.reconciliation = state.reconciliation.concat([
          {
            client: state.clients[0]?.name || 'Metro Traders',
            gstin,
            invoice: `AUTO-${Date.now()}`,
            supplier: 'Imported from books',
            booksAmount: 50000,
            portalAmount: 50000,
            diff: 0,
            status: 'Matched',
            category: 'Imported',
            review: 'Reviewed'
          }
        ]);
      }

      saveState();
      renderAll();
    };

    if (['xlsx', 'xls'].includes(ext)) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
}

function parseCsvToObjects(text) {
  const rows = text.trim().split(/\r?\n/);
  if (!rows.length) return [];

  const headers = rows[0].split(',').map((h) => h.trim().replace(/['"]/g, ''));
  return rows.slice(1).filter(Boolean).map((line) => {
    const values = line.split(',').map((cell) => cell.trim().replace(/['"]/g, ''));
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  });
}

function runReconciliation() {
  const rows = state.reconciliation.length ? state.reconciliation : [
    {
      client: 'Metro Traders',
      gstin: '27ABCDE1234F1Z5',
      invoice: 'INV-1001',
      supplier: 'Shree Steel Industries',
      booksAmount: 220000,
      portalAmount: 220000,
      diff: 0,
      status: 'Matched',
      category: 'Exact match',
      review: 'Ready'
    },
    {
      client: 'Metro Traders',
      gstin: '27ABCDE1234F1Z5',
      invoice: 'INV-1018',
      supplier: 'Bharat Components',
      booksAmount: 98500,
      portalAmount: 102400,
      diff: 3900,
      status: 'Matched with Difference',
      category: 'Amount differs',
      review: 'Action required'
    },
    {
      client: 'Metro Traders',
      gstin: '27ABCDE1234F1Z5',
      invoice: 'INV-1042',
      supplier: 'Apex Logistics',
      booksAmount: 125000,
      portalAmount: 0,
      diff: 125000,
      status: 'Missing in Portal',
      category: 'Missing in GSTR-2B',
      review: 'Action required'
    }
  ];

  state.reconciliation = rows;
  document.getElementById('booksCount').textContent = String(rows.length);
  document.getElementById('portalCount').textContent = String(rows.length);
  document.getElementById('matchSummary').textContent = `${rows.filter((r) => ['Matched', 'Matched with Difference'].includes(r.status)).length} / ${rows.length}`;

  renderReconciliationTable();
  saveState();
  openScreen('reco');
}

function renderReconciliationTable() {
  const rows = state.reconciliation || [];
  document.getElementById('recoTable').innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Invoice</th>
            <th>Supplier</th>
            <th>Books ₹</th>
            <th>Portal ₹</th>
            <th>Difference</th>
            <th>Status</th>
            <th>Issue</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${(rows || []).map((r) => `
            <tr>
              <td>${r.client}</td>
              <td>${r.invoice}</td>
              <td>${r.supplier}</td>
              <td>${formatMoney(r.booksAmount)}</td>
              <td>${formatMoney(r.portalAmount)}</td>
              <td>${formatMoney(r.diff)}</td>
              <td><span class="status-badge ${r.status === 'Matched' ? 'status-matched' : r.status === 'Matched with Difference' ? 'status-diff' : 'status-review'}">${r.status}</span></td>
              <td>${r.category}</td>
              <td>${r.review}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderReturnTable(type) {
  const data = {
    gstr1: [
      ['Taxable outward supplies', '₹42,15,000', 'Validated'],
      ['Zero-rated supplies', '₹3,30,000', 'Checked'],
      ['Exports', '₹1,40,000', 'OK'],
      ['Amendments', '₹0', 'Pending']
    ],
    gstr3b: [
      ['Outward taxable supplies', '₹41,80,000', 'Validated'],
      ['IGST', '₹7,06,800', 'Ready'],
      ['ITC claimed', '₹6,55,000', 'Review'],
      ['Tax payment', '₹7,12,900', 'Ready']
    ],
    gstr9: [
      ['Annual turnover', '₹5,10,00,000', 'Draft'],
      ['ITC availed', '₹18,40,000', 'Draft'],
      ['Tax liabilities', '₹9,26,000', 'Pending'],
      ['Adjustments', '₹0', 'Pending']
    ],
    gstr9c: [
      ['Turnover as per books', '₹5,10,00,000', 'Draft'],
      ['GST turnover', '₹5,06,25,000', 'Draft'],
      ['Reconciliation differences', '₹3,75,000', 'Check'],
      ['Audit notes', 'Required', 'Pending']
    ]
  };

  document.getElementById('returnTable').innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Line item</th>
            <th>Value</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${(data[type] || data.gstr1).map(([name, value, status]) => `
            <tr>
              <td>${name}</td>
              <td>${value}</td>
              <td><span class="status-badge ${status === 'Validated' || status === 'Ready' || status === 'OK' ? 'status-matched' : status === 'Pending' || status === 'Review' || status === 'Check' ? 'status-review' : 'status-diff'}">${status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function runValidation() {
  state.validation = [
    { invoice: 'INV-1018', issue: 'Taxable value differs by ₹3,900', category: 'Reconciliation difference', status: 'Needs review' },
    { invoice: 'INV-1042', issue: 'Invoice missing from GSTR-2B', category: 'Possible compliance gap', status: 'Needs review' },
    { invoice: 'INV-1135', issue: 'Portal invoice not in books', category: 'Missing in books', status: 'Action required' }
  ];

  renderValidationTable();
  saveState();
}

function renderValidationTable() {
  document.getElementById('validationTable').innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Issue</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${(state.validation || []).map((v) => `
            <tr>
              <td>${v.invoice}</td>
              <td>${v.issue}</td>
              <td>${v.category}</td>
              <td><span class="status-badge ${v.status === 'Passed' ? 'status-matched' : 'status-review'}">${v.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderRuleTable() {
  document.getElementById('ruleTable').innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Rule ID</th>
            <th>Title</th>
            <th>Provision</th>
            <th>Effective</th>
            <th>Evidence</th>
          </tr>
        </thead>
        <tbody>
          ${(state.rules || []).map((rule) => `
            <tr>
              <td>${rule.id}</td>
              <td>${rule.title}</td>
              <td>${rule.provision}</td>
              <td>${rule.effectiveDate}</td>
              <td>${rule.evidence}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderMappingTable() {
  const mappings = [
    { source: 'Invoice No.', target: 'invoice_no', confidence: 'High' },
    { source: 'GSTIN / GST Number', target: 'supplier_gstin', confidence: 'High' },
    { source: 'Taxable Amount', target: 'taxable_value', confidence: 'High' },
    { source: 'Invoice Date', target: 'invoice_date', confidence: 'Medium' },
    { source: 'IGST', target: 'igst', confidence: 'Medium' }
  ];

  document.getElementById('mappingTable').innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Source field</th>
            <th>Mapped target</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          ${mappings.map((m) => `
            <tr>
              <td>${m.source}</td>
              <td>${m.target}</td>
              <td>${m.confidence}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderLogsTable() {
  document.getElementById('logTable').innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Type</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          ${(state.imports || []).map((item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.type}</td>
              <td>${item.status}</td>
              <td>${new Date(item.importedAt || Date.now()).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderReportSummary() {
  document.getElementById('reportSummary').innerHTML = `
    <div class="two-col">
      <div class="panel">
        <h3>Purchase Register vs GSTR-2B</h3>
        <div class="mini">Records: 318</div>
        <div class="mini">Matches: 290</div>
        <div class="mini">Exceptions: 12</div>
        <button class="btn primary" style="margin-top: 12px;" onclick="exportCSV('summary')">Download report</button>
      </div>
      <div class="panel">
        <h3>Sales Register vs GSTR-1</h3>
        <div class="mini">Records: 412</div>
        <div class="mini">Matches: 396</div>
        <div class="mini">Exceptions: 7</div>
        <button class="btn primary" style="margin-top: 12px;" onclick="exportCSV('exceptions')">Download exceptions</button>
      </div>
    </div>
  `;
}

function formatMoney(value) {
  const num = Number(value || 0);
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
}

function exportCSV(type) {
  const rows = [];

  if (type === 'reco') {
    rows.push(['client', 'invoice', 'supplier', 'books_amount', 'portal_amount', 'difference', 'status', 'issue', 'review']);
    state.reconciliation.forEach((r) => rows.push([r.client, r.invoice, r.supplier, r.booksAmount, r.portalAmount, r.diff, r.status, r.category, r.review]));
  } else if (type === 'summary') {
    rows.push(['metric', 'value']);
    rows.push(['active_clients', state.clients.length]);
    rows.push(['recent_imports', state.imports.length]);
    rows.push(['exceptions', state.validation.length]);
  } else {
    rows.push(['invoice', 'issue', 'category', 'status']);
    state.validation.forEach((v) => rows.push([v.invoice, v.issue, v.category, v.status]));
  }

  const csv = rows.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `gst_${type}_${Date.now()}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function testAiConnection() {
  const provider = document.getElementById('aiProvider').value;
  const key = document.getElementById('aiKey').value.trim();
  const model = document.getElementById('aiModel').value.trim() || 'openai/gpt-oss-20b:free';
  const statusBox = document.getElementById('aiStatus');

  if (provider === 'local' || !key) {
    statusBox.className = 'notice';
    statusBox.textContent = 'Local rule-based assistant is active. Add a key for live AI analysis.';
    return;
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://example.com',
        'X-Title': 'GST Practice Suite'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Return a short GST reconciliation summary in 2 lines.' }]
      })
    });

    if (!response.ok) throw new Error(`AI request failed: ${response.status}`);

    const data = await response.json();
    const message = data?.choices?.[0]?.message?.content || 'AI responded.';
    statusBox.className = 'success-block';
    statusBox.textContent = `AI connection successful. ${message}`;
  } catch (err) {
    statusBox.className = 'danger-block';
    statusBox.textContent = 'AI request failed. Check your API key and model. ' + err.message;
  }
}

function init() {
  if (!localStorage.getItem('gst_practice_state')) {
    seedSampleData();
    saveState();
  } else {
    loadState();
  }

  bindUI();
  renderAll();
}

init();
