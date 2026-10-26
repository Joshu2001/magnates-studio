const fs = require('fs');

function createDocSvg(caseNum, date, page, title, subtitle, paragraphs, stamps) {
  let bodySvg = '';
  let y = 140;
  for (const p of paragraphs) {
    if (p.type === 'heading') {
      bodySvg += `<text x="50%" y="${y}" text-anchor="middle" font-family="'Times New Roman', serif" font-size="14" font-weight="bold" fill="#111827" letter-spacing="1">${p.text}</text>\n`;
      y += 24;
    } else if (p.type === 'caption') {
      bodySvg += `<rect x="60" y="${y}" width="560" height="150" fill="none" stroke="#374151" stroke-width="1.2" />\n`;
      bodySvg += `<line x="340" y="${y}" x="340" y="${y+150}" stroke="#374151" stroke-width="1.2" />\n`;
      bodySvg += `<text x="75" y="${y+30}" font-family="'Times New Roman', serif" font-size="12" font-weight="bold" fill="#111827">IN RE:</text>\n`;
      bodySvg += `<text x="75" y="${y+58}" font-family="'Times New Roman', serif" font-size="13" font-weight="bold" fill="#111827">${p.inRe}</text>\n`;
      bodySvg += `<text x="75" y="${y+120}" font-family="'Times New Roman', serif" font-size="11" fill="#374151">Debtors.</text>\n`;
      bodySvg += `<text x="355" y="${y+30}" font-family="'Times New Roman', serif" font-size="12" font-weight="bold" fill="#111827">Chapter 11</text>\n`;
      bodySvg += `<text x="355" y="${y+58}" font-family="'Times New Roman', serif" font-size="12" fill="#111827">Case No. ${caseNum}</text>\n`;
      bodySvg += `<text x="355" y="${y+86}" font-family="'Times New Roman', serif" font-size="12" fill="#111827">(Jointly Administered)</text>\n`;
      y += 175;
    } else {
      const lines = p.lines || 3;
      for (let l = 0; l < lines; l++) {
        const indent = (l === 0 && p.num) ? 90 : 60;
        const numLabel = (l === 0 && p.num) ? `<text x="65" y="${y}" font-family="'Times New Roman', serif" font-size="12.5" font-weight="bold" fill="#111827">${p.num}.</text>\n` : '';
        const sample = (l === 0) ? (p.textSample || 'The Debtors respectfully submit this Emergency Declaration in support of relief.') : 'management repeatedly represented compliance with financial controls, yet commingled retail investor deposits.';
        bodySvg += `${numLabel}<text x="${indent}" y="${y}" font-family="'Times New Roman', serif" font-size="12" fill="#1f2937" letter-spacing="0.1">${sample}</text>\n`;
        y += 20;
      }
      y += 12;
    }
  }

  let stampSvg = '';
  if (stamps && stamps.length) {
    for (const s of stamps) {
      stampSvg += `<g transform="translate(${s.x}, ${s.y}) rotate(${s.rot})">
        <rect x="-85" y="-24" width="170" height="48" rx="3" fill="none" stroke="${s.color || '#dc2626'}" stroke-width="2.5" stroke-dasharray="5,3" opacity="0.88" />
        <text x="0" y="-3" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-size="15" font-weight="bold" fill="${s.color || '#dc2626'}" opacity="0.9" letter-spacing="2">${s.text}</text>
        <text x="0" y="15" text-anchor="middle" font-family="'Courier New', monospace" font-size="9.5" font-weight="bold" fill="${s.color || '#dc2626'}" opacity="0.9">${s.sub || 'UNITED STATES COURT'}</text>
      </g>\n`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 880" width="680" height="880">
  <defs>
    <filter id="doc-subtle-grain" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.96   0 0 0 0 0.95   0 0 0 0 0.93  0 0 0 0.07 0" />
      <feBlend mode="multiply" in="SourceGraphic" />
    </filter>
  </defs>

  <rect x="0" y="0" width="680" height="880" fill="#fcfbfa" stroke="#e5e7eb" stroke-width="1" rx="2" />
  <rect x="0" y="0" width="680" height="880" fill="url(#doc-subtle-grain)" opacity="0.5" />

  <line x="45" y="32" x="635" y="32" stroke="#9ca3af" stroke-width="0.8" />
  <text x="50%" y="24" text-anchor="middle" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#4b5563" letter-spacing="1.5">Case ${caseNum}   Filed ${date}   ${page}</text>

  <text x="50%" y="68" text-anchor="middle" font-family="'Times New Roman', serif" font-size="16" font-weight="bold" fill="#111827" letter-spacing="1.2">${title}</text>
  <text x="50%" y="92" text-anchor="middle" font-family="'Times New Roman', serif" font-size="13.5" font-weight="600" fill="#374151">${subtitle}</text>
  <line x="50" y="108" x="630" y="108" stroke="#111827" stroke-width="1.5" />

  ${bodySvg}
  ${stampSvg}

  <text x="50%" y="855" text-anchor="middle" font-family="'Times New Roman', serif" font-size="11" fill="#6b7280">${page}</text>
</svg>`;
}

const doc1 = createDocSvg('22-11068-JTD', '11/14/22', 'Page 1 of 8', 'IN THE UNITED STATES BANKRUPTCY COURT', 'FOR THE DISTRICT OF DELAWARE', [
  { type: 'caption', inRe: 'FTX TRADING LTD., et al.' },
  { type: 'heading', text: 'MOTION OF DEBTORS FOR ENTRY OF AN ORDER AUTHORIZING' },
  { type: 'heading', text: 'CERTAIN CREDITORS PROCEDURES AND EMERGENCY RELIEF' },
  { num: '1', lines: 3, textSample: 'On November 11, 2022, each of the Debtors filed a voluntary petition under Chapter 11 of the Bankruptcy Code.' },
  { num: '2', lines: 3, textSample: 'The Debtors seek immediate relief regarding multi-billion dollar promotional endorsements and influencer contracts.' },
  { num: '3', lines: 4, textSample: 'Never in my career have I seen such a complete failure of corporate controls and complete absence of trustworthy accounts.' }
], [{ x: 530, y: 100, rot: -8, text: 'FILED UNDER SEAL', color: '#b91c1c' }]);

const doc2 = createDocSvg('22-11068-JTD', '11/14/22', 'Page 2 of 8', 'UNITED STATES DISTRICT COURT', 'SOUTHERN DISTRICT OF NEW YORK', [
  { type: 'heading', text: 'CLASS-ACTION COMPLAINT FOR MULTI-BILLION DAMAGES' },
  { type: 'heading', text: 'VIOLATION OF THE SECURITIES EXCHANGE ACT OF 1934' },
  { num: '12', lines: 3, textSample: 'Plaintiffs bring this nationwide class action on behalf of all retail purchasers who held unregistered accounts.' },
  { num: '13', lines: 3, textSample: 'Defendants made false representations asserting that client custody funds were safely backed 1-to-1 at all times.' },
  { num: '14', lines: 4, textSample: 'Promotional marketing deceptively portrayed high-risk speculative tokens as insured custodial reserve deposits.' }
], [{ x: 520, y: 180, rot: 10, text: 'CLASS ACTION', color: '#1d4ed8' }]);

const doc3 = createDocSvg('22-11068-JTD', '11/14/22', 'Page 4 of 8', 'UNITED STATES BANKRUPTCY COURT', 'DISTRICT OF DELAWARE - DISCOVERY EX. B', [
  { type: 'heading', text: 'DECLARATION OF FORENSIC RESTRUCTURING EXECUTIVES' },
  { num: '28', lines: 3, textSample: 'The Debtors did not maintain centralized ledgers or accurate accounting of customer cryptocurrency holdings.' },
  { num: '29', lines: 4, textSample: 'Management utilized an unsecured automated script to grant undisclosed credit limits exceeding eight billion dollars.' },
  { num: '30', lines: 4, textSample: 'Corporate funds were routinely commingled and deployed into speculative leveraged proprietary trading positions.' }
], [{ x: 130, y: 720, rot: -6, text: 'EXHIBIT A', color: '#d97706' }]);

const doc4 = createDocSvg('22-11068-JTD', '11/14/22', 'Page 7 of 8', 'SUPERIOR COURT OF THE STATE OF DELAWARE', 'CONFIDENTIAL DEPOSITION TRANSCRIPT & SUBPOENA', [
  { type: 'heading', text: 'SCHEDULE OF CELEBRITY ENDORSEMENTS & SPONSORSHIPS' },
  { num: '44', lines: 3, textSample: 'Celebrity brand ambassadors received upwards of $100,000,000 in promotional fees and token equity grants.' },
  { num: '45', lines: 4, textSample: 'Television advertisements promised consumers guaranteed interest returns without disclosing extreme liquidity risks.' },
  { num: '46', lines: 4, textSample: 'Internal communications acknowledge that customer deposits were used directly to fund international stadium naming rights.' }
], [{ x: 510, y: 110, rot: 14, text: 'SUBPOENA EVIDENCE', color: '#b91c1c' }]);

fs.writeFileSync('magnates-studio/public/legal_court_filing_doc1.svg', doc1);
fs.writeFileSync('magnates-studio/public/legal_court_filing_doc2.svg', doc2);
fs.writeFileSync('magnates-studio/public/legal_court_filing_doc3.svg', doc3);
fs.writeFileSync('magnates-studio/public/legal_court_filing_doc4.svg', doc4);
console.log('Successfully created all 4 legal court document SVGs!');
