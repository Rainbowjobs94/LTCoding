import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ShieldAlert, ShieldCheck, Lock, FileCode2, XCircle, AlertTriangle, Terminal,
  Database, Cpu, Copy, Search, RefreshCw, Scale, GitCommit, CheckCircle2,
  Check, FileText, Activity
} from 'lucide-react';

const H = {
  permit: '0e158a2e335c0053469335cecb0a42e9c77f644fdc259d6d5021a8b7292193cc',
  trust: '3ed74fa4611dc9f7bac1678683ca6b2275466eeef2b4cd7a7ebbd74034819d10',
  readme: '65d3970d8fe058ead5d940d10c9c4e58ff29c4c7605dbf8b057e4b9feb1b7bda',
  skill: 'cb2f3beb884160ae70531fa7d32439c4f419e9b69b8a80f5abed599bb1c15549',
  policy: 'a00464880e70da6d208149aae3535eb79709815a2a19fb5bccc61b543b6c26cb'
};
const POLICY_TEST = 'scripts/report-template-proof-lab/policy.test.mjs';
const SPEC = 'docs/mining/report-template-proof-validation.md';
const missing = (o) => ({ sourceRepo: 'None in workspace', pinnedCommit: 'UNKNOWN', filePath: 'UNKNOWN', sha256: 'UNKNOWN', license: 'UNKNOWN', ...o });
const synthetic = (o) => ({ status: 'SYNTHETIC_ONLY', sourceRepo: POLICY_TEST, pinnedCommit: 'WORKSPACE_LOCAL', filePath: POLICY_TEST, sha256: 'UNKNOWN', license: 'Proprietary (LTR)', ...o });

const EVIDENCE_ITEMS = [
  missing({ id: 1, title: 'Verifier Implementation & Version', category: 'Core Verifier', status: 'UNKNOWN', evidenceType: 'Missing Binary / Library Wrapper',
    details: 'Requires a concrete verifier binary or pinned library release (e.g., snarkjs, halo2, or bellman verifier). The workspace only contains EIP-712 / ECDSA attestations and VirusTotalScanner wrappers, which do not verify ZK/cryptographic compute or storage proofs.' }),
  missing({ id: 2, title: 'Circuit / Program Definition', category: 'Circuit / R1CS', status: 'UNKNOWN', evidenceType: 'Missing Circuit Source',
    details: 'Requires deterministic circuit/program source (.circom, Noir, or Rust/Arkworks) and compiled constraint artifacts (.r1cs, .wasm) defining the exact compute or storage relation.' }),
  missing({ id: 3, title: 'Public Verifying Key (VK)', category: 'Cryptographic Key', status: 'UNKNOWN', evidenceType: 'Missing Verifying Key',
    details: 'Requires the public verifying key (e.g., verification_key.json) derived from the trusted setup or transparent SRS for Item 02, with its pinned SHA-256 digest.' }),
  missing({ id: 4, title: 'Proof Statement & Public-Input Spec', category: 'Specification', status: 'UNKNOWN', evidenceType: 'Unverified Field Ordering',
    sourceRepo: SPEC, pinnedCommit: 'WORKSPACE_LOCAL', filePath: SPEC, license: 'Proprietary (LTR)',
    details: 'Requires exact public-input field order, finite-field modulus, byte-packing rules, endianness, and domain-separation tags (chainId, contract, epoch, workId).' }),
  synthetic({ id: 5, title: 'Positive Compute-Proof Vectors', category: 'Test Vector (Compute)', evidenceType: 'Synthetic Policy Fixture Only',
    details: 'A genuine compute-proof vector is UNKNOWN. The test suite uses synthetic mock objects and intentionally skips genuine cryptographic verification.' }),
  synthetic({ id: 6, title: 'Positive Storage-Proof Vectors', category: 'Test Vector (Storage)', evidenceType: 'Synthetic Policy Fixture Only',
    details: 'A genuine storage-proof vector (committed Merkle root, challenged chunk bytes, index, Merkle path/opening, proof bytes) is UNKNOWN.' }),
  synthetic({ id: 7, title: 'Negative Case Test Vectors', category: 'Adversarial Testing', evidenceType: 'Policy-Level Rejection Checks',
    details: 'Cryptographic negative vectors (tampered proof bytes, mutated public inputs, wrong Merkle sibling path, altered chunk index) against a real verifier are UNKNOWN.' }),
  synthetic({ id: 8, title: 'Replay / Alternate Encoding Vectors', category: 'Replay Defense', evidenceType: 'Nullifier / Canonical Work-ID Policy',
    details: 'Requires a genuine proof vector tested with an alternate valid encoding (non-canonical field representation or padded hex) to prove canonicalization/nullifier rejection.' }),
  { id: 9, title: 'Provenance & Inventory Manifest', category: 'Provenance', status: 'PARTIAL_WORKSPACE', evidenceType: 'Workspace Inventory SHA-256 Hashes',
    sourceRepo: 'FILE-INVENTORY.csv', pinnedCommit: 'WORKSPACE_LOCAL', filePath: 'artifacts/api-server/src/kem/*', sha256: H.permit, license: 'Proprietary (LTR)',
    details: 'FILE-INVENTORY.csv pins KEM_PERMIT_COMPATIBILITY.md (0e158a2e...), KEM_TRUST_BOUNDARY.md (3ed74fa4...), and kem/README.md (65d3970d...). None of these contain ZK/storage proof circuits or verifying keys. The hash shown is the first of these.' }
].map((i) => ({ retrievalDate: '2026-10-18', ...i }));

const STATUS_COUNTS = EVIDENCE_ITEMS.reduce((a, i) => ({ ...a, [i.status]: (a[i.status] || 0) + 1 }), {});

const WORKSPACE_FILES = [
  { path: 'artifacts/api-server/src/kem/KEM_PERMIT_COMPATIBILITY.md', bytes: 1179, sha256: H.permit, role: 'EIP-712 Permit Compatibility Spec (Not a ZK Verifier)' },
  { path: 'artifacts/api-server/src/kem/KEM_TRUST_BOUNDARY.md', bytes: 1251, sha256: H.trust, role: 'Off-chain Attestor Trust Boundary Documentation' },
  { path: 'artifacts/api-server/src/kem/README.md', bytes: 2882, sha256: H.readme, role: 'KEM Module Overview & Heuristic Rules' },
  { path: '.agents/skills/iaguardian-onecode/SKILL.md', bytes: 11582, sha256: H.skill, role: 'IA-Guardian OneCode Governance Skill Definition' },
  { path: 'artifacts/api-server/test/agent-policy.test.ts', bytes: 5658, sha256: H.policy, role: 'Agent Hub Policy & Hash-Gated Approval Tests' }
];

const MISMATCHES = [
  { id: 'MISMATCH-01', severity: 'CRITICAL', title: 'EIP-712 / ECDSA Attestation vs. Cryptographic Compute/Storage Proof',
    existingSignal: 'kem_miracle_backend.py & KEMRewardsController.sol validate typing duration (>=60s), efficiency (>=0.15), OpenWeather UV index, and sign an EIP-712 permit.',
    requiredSpec: `${SPEC} requires an independently verifiable cryptographic compute-proof and storage-proof verifier with a circuit, public verifying key, and Merkle opening.`,
    impact: 'A server signature, CID, or heuristic check is an attestation of trust in the server, not a cryptographic proof of compute or storage work.' },
  { id: 'MISMATCH-02', severity: 'CRITICAL', title: 'NIST FIPS 203 ML-KEM-768 Role Confusion',
    existingSignal: 'Some legacy summaries refer to ML-KEM-768 as a "verification" or "watermark attestation" mechanism.',
    requiredSpec: 'Per LTReality_Web3_Network_Expansion_Deep_Research_Report.docx (Section 5.3), ML-KEM is a Key-Encapsulation Mechanism for establishing shared secrets off-chain, not a digital signature or zero-knowledge proof system.',
    impact: 'ML-KEM ciphertexts cannot be used as publicly verifiable compute or storage proofs.' },
  { id: 'MISMATCH-03', severity: 'HIGH', title: 'Skipped Genuine-Proof Control in policy.test.mjs',
    existingSignal: `${POLICY_TEST} runs synthetic policy tests only and skips the genuine-proof test case.`,
    requiredSpec: 'No report template may be reused or deployed until genuine-proof vectors (positive compute, positive storage, negative mutations, replay encodings) are integrated and approved by the owner.',
    impact: 'Template reuse and reward activation remain BLOCKED.' }
];

const ROOT = '0x8b9e3f11c67d9a04e2318c7b5d6a9f0123456789abcdef0123456789abcdef01';
const VECTORS = {
  positive_compute_synthetic: { name: 'Synthetic Compute Claim (Policy Check Only)', mode: 'SYNTHETIC_ADAPTER', claimType: 'COMPUTE_WORK',
    workId: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069', epoch: 42, proverAddress: '0x4a09D10E226cCD791440233B00a311584105787c',
    publicInputs: { circuitVersion: 'UNKNOWN_SYNTHETIC_V0', taskCommitment: '0x9a01...e4b2', outputHash: '0x3c99...11a0', cycleCount: 1048576 },
    proofBytes: '0x[SYNTHETIC_PLACEHOLDER_NOT_A_REAL_ZK_PROOF]', genuineVerifierAvailable: false, expectedPolicyResult: 'SYNTHETIC_PASS_GENUINE_SKIPPED' },
  positive_storage_synthetic: { name: 'Synthetic Storage Claim (Merkle Opening Simulation)', mode: 'SYNTHETIC_ADAPTER', claimType: 'STORAGE_WORK',
    workId: '0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae', epoch: 42, committedRoot: ROOT, challengedIndex: 7,
    challengedChunkHex: '0x4c544169436f6c6c61622d3132332d373130345f4348554e4b5f3037',
    merklePath: ['0x' + '11'.repeat(32), '0x' + '22'.repeat(32), '0x' + '33'.repeat(32)],
    proofBytes: '0x[SYNTHETIC_STORAGE_PROOF_PLACEHOLDER]', genuineVerifierAvailable: false, expectedPolicyResult: 'SYNTHETIC_PASS_GENUINE_SKIPPED' },
  negative_tampered_root: { name: 'Negative Test: Mutated Committed Root / Chunk Index', mode: 'SYNTHETIC_ADAPTER', claimType: 'STORAGE_WORK',
    workId: '0x99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa', epoch: 42, committedRoot: '0x' + 'FF'.repeat(32), expectedRoot: ROOT,
    challengedIndex: 999, tamperedField: 'committedRoot & challengedIndex mismatch', genuineVerifierAvailable: false, expectedPolicyResult: 'REJECTED_INVALID_COMMITMENT' },
  negative_replay_alternate_encoding: { name: 'Negative Test: Alternate Encoding of Consumed Work (Replay)', mode: 'SYNTHETIC_ADAPTER', claimType: 'COMPUTE_WORK',
    canonicalWorkId: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    submittedEncoding: '0X007F83B1657FF1FC53B92DC18148A1D65DFC2D4B1FA3D677284ADDD200126D9069',
    encodingMutation: 'Uppercase hex prefix + leading zero padding on already-consumed workId', alreadyConsumedInEpoch: 42,
    genuineVerifierAvailable: false, expectedPolicyResult: 'REJECTED_REPLAY_CONSUMED_WORK' }
};

const SAMPLE_LOG = [
  { id: 't1', test: 'rejects empty or unformatted work claims', status: 'PASS', detail: 'Synthetic schema check passed.' },
  { id: 't2', test: 'rejects tampered root, chunk, index, or path in synthetic adapter', status: 'PASS', detail: 'Mismatched root 0xFFFF... vs 0x8b9e... rejected.' },
  { id: 't3', test: 'rejects alternate encoding of already-consumed workId (replay guard)', status: 'PASS', detail: 'Canonicalized 0X007F83... to 0x7f83... and blocked the duplicate claim.' },
  { id: 't4', test: 'verifies genuine cryptographic compute & storage proofs', status: 'SKIPPED', detail: 'INTENTIONALLY SKIPPED: genuine verifier, circuit, VK, and independent vectors are UNKNOWN and await owner approval.' }
];

const CHECKLIST = [
  { step: '1. Pin Verifier Implementation', desc: 'Select and pin the exact verifier library/binary (e.g., Groth16/Plonk via snarkjs, Halo2, RISC Zero, SP1) with repository URL, release tag, commit SHA, and SHA-256 digest.' },
  { step: '2. Commit Circuit / Program Source', desc: 'Commit the exact circuit or guest program source plus deterministic build outputs (.r1cs, .wasm, or ELF) and their hashes.' },
  { step: '3. Export & Hash Public Verifying Key (VK)', desc: 'Provide the public verifying key for the compiled circuit and record its SHA-256 digest in the specification.' },
  { step: '4. Formalize Public-Input Encoding', desc: 'Document field order, finite-field modulus, endianness, byte-packing rules, and domain separation (chainId, contract address, epoch, workId).' },
  { step: '5. Positive Compute & Storage Vectors', desc: 'Provide real proof bytes and public inputs for compute and storage work (Merkle root, challenged chunk, index, opening path) that pass the real verifier.' },
  { step: '6. Negative & Replay Vectors', desc: 'Provide reproducible failing vectors (mutated inputs, corrupted bytes, altered Merkle path) and an alternate encoding to prove replay rejection.' }
];

const BADGES = {
  UNKNOWN: ['bg-red-500/10 text-red-400 border-red-500/20', XCircle, 'UNKNOWN (MISSING)'],
  SYNTHETIC_ONLY: ['bg-amber-500/10 text-amber-400 border-amber-500/20', AlertTriangle, 'SYNTHETIC ONLY'],
  PARTIAL_WORKSPACE: ['bg-blue-500/10 text-blue-400 border-blue-500/20', FileCode2, 'PARTIAL WORKSPACE']
};
const StatusBadge = ({ status }) => {
  const [cls, Icon, label] = BADGES[status];
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${cls}`}><Icon className="w-3.5 h-3.5" />{label}</span>;
};

const TABS = [
  { id: 'matrix', label: 'Evidence', icon: Scale },
  { id: 'mismatches', label: 'Mismatches', icon: AlertTriangle },
  { id: 'sandbox', label: 'Sandbox', icon: Terminal },
  { id: 'checklist', label: 'Approval', icon: Lock }
];
const card = 'bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl';

export default function App() {
  const [activeTab, setActiveTab] = useState('matrix');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedVectorKey, setSelectedVectorKey] = useState('positive_compute_synthetic');
  const [log, setLog] = useState([]);
  const [hasRun, setHasRun] = useState(false);
  const [running, setRunning] = useState(false);
  const [toast, setToast] = useState('');
  const [checked, setChecked] = useState(() => new Set());
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return EVIDENCE_ITEMS.filter((i) =>
      (statusFilter === 'ALL' || i.status === statusFilter) &&
      (i.title.toLowerCase().includes(q) || i.details.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)));
  }, [searchQuery, statusFilter]);

  const showToast = (m) => {
    setToast(m);
    timers.current.push(setTimeout(() => setToast(''), 2500));
  };
  const copy = async (text, label) => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const t = document.createElement('textarea');
        t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
      }
      showToast(`Copied ${label}`);
    } catch { showToast('Copy failed'); }
  };
  const toggle = (i) => setChecked((p) => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });

  const replaySample = () => {
    if (running) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(true); setHasRun(true); setLog([]);
    SAMPLE_LOG.forEach((entry, idx) => timers.current.push(setTimeout(() => {
      setLog((p) => [...p, entry]);
      if (idx === SAMPLE_LOG.length - 1) setRunning(false);
    }, (idx + 1) * 600)));
  };

  const kpis = [
    { label: 'Genuine Verifier', value: 'UNKNOWN', tone: 'red', icon: Cpu, note: 'No ZK / storage verifier binary, circuit, or VK found in workspace.' },
    { label: 'Test Suite Status', value: 'SYNTHETIC ONLY', tone: 'amber', icon: Terminal, note: 'Genuine-proof test remains intentionally skipped.' },
    { label: 'Workspace Hashes', value: `${WORKSPACE_FILES.length} PINNED`, tone: 'indigo', icon: GitCommit, note: 'As listed in FILE-INVENTORY.csv. Not re-verified here.' },
    { label: 'Approval Status', value: 'PENDING REVIEW', tone: 'red', icon: Lock, note: 'Template reuse prohibited until artifacts are supplied and signed off.' }
  ];
  const tone = { red: 'text-red-400', amber: 'text-amber-400', indigo: 'text-indigo-400' };

  return (
    <div className="min-h-screen bg-slate-950 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans pb-20">
      <div role="status" aria-live="polite" className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${toast ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
        <div className="bg-emerald-600/90 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" />{toast}
        </div>
      </div>

      <div className="bg-red-950/60 border-b border-red-500/20 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-xs sm:text-sm text-slate-300">
              <span className="font-bold text-red-400 uppercase tracking-wider mr-2">Governance Gate: Blocked</span>
              Template reuse and genuine-proof test un-skipping are locked until all 9 artifacts are sourced and approved by the owner.
            </p>
          </div>
          <span className="hidden md:block text-xs font-mono text-red-300/80 bg-red-950/50 px-2 py-1 rounded border border-red-900/50">Spec: {SPEC}</span>
        </div>
      </div>

      <header className="border-b border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-2 py-0.5 text-xs font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md">LTAiCollab-123-7104</span>
              <span className="px-2 py-0.5 text-xs font-mono bg-slate-800/50 text-slate-300 border border-slate-700/50 rounded-md">OneCode V0.6.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Reality Nexus: Proof Validation & Evidence Lab</h1>
            <p className="text-sm text-slate-400 mt-1.5 max-w-2xl">Strict evidence matrix, synthetic policy sandbox, and owner approval checklist. Every unverified item stays UNKNOWN.</p>
          </div>
          <nav className="flex flex-wrap gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800/50" role="tablist">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} role="tab" aria-selected={activeTab === id} onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${activeTab === id ? 'bg-indigo-500/15 text-indigo-200 border-indigo-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-transparent'}`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(({ label, value, tone: t, icon: Icon, note }) => (
            <div key={label} className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold tracking-wider uppercase"><span>{label}</span><Icon className={`w-4 h-4 ${tone[t]}`} /></div>
              <div className={`mt-3 text-2xl font-bold font-mono ${tone[t]}`}>{value}</div>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">{note}</p>
            </div>
          ))}
        </section>

        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <div className={`${card} p-5 sm:p-6`}>
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6 border-b border-slate-800/50 pb-6">
                <div className="max-w-2xl">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2"><Scale className="w-5 h-5 text-indigo-400" />Evidence Matrix (Items 1 to 9)</h2>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">Signatures, CIDs, and mocks are never treated as cryptographic proof evidence.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 min-w-[320px]">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input type="text" aria-label="Filter artifacts" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Filter artifacts..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-950/50 border border-slate-700/50 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 placeholder:text-slate-600" />
                  </div>
                  <select aria-label="Status filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-950/50 border border-slate-700/50 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50">
                    <option value="ALL">All Statuses ({EVIDENCE_ITEMS.length})</option>
                    <option value="UNKNOWN">UNKNOWN ({STATUS_COUNTS.UNKNOWN || 0})</option>
                    <option value="SYNTHETIC_ONLY">SYNTHETIC ONLY ({STATUS_COUNTS.SYNTHETIC_ONLY || 0})</option>
                    <option value="PARTIAL_WORKSPACE">PARTIAL WORKSPACE ({STATUS_COUNTS.PARTIAL_WORKSPACE || 0})</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/30">
                      <th className="py-3 px-4">ID</th><th className="py-3 px-4 w-1/4">Required Artifact</th><th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 w-1/4">Source</th><th className="py-3 px-4">SHA-256</th><th className="py-3 px-4 w-1/3">Assessment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm">
                    {filtered.length === 0 ? (
                      <tr><td colSpan="6" className="py-8 text-center text-slate-500">No items match your filter.</td></tr>
                    ) : filtered.map((i) => (
                      <tr key={i.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-5 px-4 font-mono font-bold text-indigo-400/80 align-top">0{i.id}</td>
                        <td className="py-5 px-4 align-top"><div className="font-semibold text-slate-200">{i.title}</div><div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{i.category}</div></td>
                        <td className="py-5 px-4 align-top"><StatusBadge status={i.status} /><div className="text-xs text-slate-500 mt-2">{i.evidenceType}</div></td>
                        <td className="py-5 px-4 align-top font-mono text-xs">
                          <div className="text-slate-300 break-all mb-1.5">{i.sourceRepo}</div>
                          <div className="text-slate-500">Rev: {i.pinnedCommit}</div>
                          <div className="text-slate-500">Date: {i.retrievalDate}</div>
                        </td>
                        <td className="py-5 px-4 align-top font-mono text-xs">
                          {i.sha256 === 'UNKNOWN' ? <span className="text-red-400 font-semibold">UNKNOWN</span> : (
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-400" title={i.sha256}>{i.sha256.slice(0, 8)}...{i.sha256.slice(-6)}</span>
                              <button aria-label="Copy full SHA-256" onClick={() => copy(i.sha256, `hash for item ${i.id}`)} className="p-1 rounded bg-slate-800 hover:bg-emerald-500/20 text-slate-300"><Copy className="w-3.5 h-3.5" /></button>
                            </div>
                          )}
                        </td>
                        <td className="py-5 px-4 align-top text-xs text-slate-400 leading-relaxed">{i.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-5 sm:p-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2"><Database className="w-5 h-5 text-emerald-400" />Workspace Provenance (as listed in FILE-INVENTORY.csv)</h3>
              <p className="text-sm text-slate-400 mb-5 max-w-3xl leading-relaxed">These files document the off-chain KEM permit boundary and agent policy. They are not zero-knowledge proof components. Hashes are copied from the inventory and were not recomputed here.</p>
              <div className="grid gap-3">
                {WORKSPACE_FILES.map((f) => (
                  <div key={f.path} className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-semibold text-indigo-300 break-all">{f.path}</span>
                        <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">{f.bytes} B</span>
                      </div>
                      <p className="text-xs text-slate-400">{f.role}</p>
                    </div>
                    <div className="flex items-center gap-2 font-mono bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-700/50 shrink-0 justify-between">
                      <span className="text-emerald-400 text-xs" title={f.sha256}>SHA256: {f.sha256.slice(0, 12)}...</span>
                      <button aria-label="Copy full SHA-256" onClick={() => copy(f.sha256, 'workspace hash')} className="text-slate-400 hover:text-emerald-300 p-1 bg-slate-800 rounded"><Copy className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mismatches' && (
          <div className={`${card} p-5 sm:p-6`}>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-3"><AlertTriangle className="w-6 h-6 text-amber-400" />Architectural Mismatches</h2>
            <p className="text-sm text-slate-400 mb-8 max-w-3xl leading-relaxed">Discrepancies between the existing codebase (kem_miracle_backend.py, KEMRewardsController.sol) and the target proof specification, shown as source evidence versus required standard.</p>
            <div className="grid gap-6">
              {MISMATCHES.map((m) => (
                <div key={m.id} className="p-5 sm:p-6 rounded-2xl bg-slate-950/50 border border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50" />
                  <div className="flex items-center gap-3 mb-4 pl-3">
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">{m.id}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{m.severity} severity</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-200 mb-5 pl-3">{m.title}</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pl-3">
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Database className="w-3.5 h-3.5" />Existing Signal</div>
                      <p className="text-sm text-slate-300 leading-relaxed">{m.existingSignal}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
                      <div className="font-semibold text-xs text-indigo-300 uppercase tracking-wider mb-3 flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5" />Required Standard</div>
                      <p className="text-sm text-indigo-100/80 leading-relaxed">{m.requiredSpec}</p>
                    </div>
                  </div>
                  <div className="mt-4 pl-3">
                    <div className="text-sm text-amber-200/90 bg-amber-950/30 border border-amber-900/50 rounded-xl p-4 leading-relaxed flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div><strong className="text-amber-400 block mb-1 uppercase text-xs tracking-wider">Security Impact</strong>{m.impact}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <div className={`${card} p-5`}>
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3"><Terminal className="w-5 h-5 text-indigo-400" />Policy Sandbox</h2>
                <p className="text-sm text-slate-400 mb-5 leading-relaxed">Select a synthetic vector to inspect its payload. The button replays a fixed sample of expected results. It does not run policy.test.mjs.</p>
                <div className="space-y-2.5 mb-6">
                  {Object.entries(VECTORS).map(([key, v]) => (
                    <button key={key} onClick={() => setSelectedVectorKey(key)} aria-pressed={selectedVectorKey === key}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-2 ${selectedVectorKey === key ? 'bg-indigo-500/10 border-indigo-500/40' : 'bg-slate-950/50 border-slate-800 hover:border-slate-600'}`}>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className={selectedVectorKey === key ? 'text-indigo-300' : 'text-slate-400'}>{v.claimType}</span>
                        <span className="px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-amber-400 text-[10px]">{v.mode}</span>
                      </div>
                      <div className={`text-sm font-medium ${selectedVectorKey === key ? 'text-indigo-100' : 'text-slate-300'}`}>{v.name}</div>
                    </button>
                  ))}
                </div>
                <button onClick={replaySample} disabled={running}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center justify-center gap-2">
                  <RefreshCw className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />{running ? 'Replaying...' : 'Replay sample output'}
                </button>
              </div>
            </div>
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className={`${card} overflow-hidden`}>
                <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2"><FileText className="w-4 h-4" />Payload Inspector</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">Not crypto proof evidence</span>
                </div>
                <div className="p-4 bg-[#0d1117] overflow-x-auto"><pre className="text-xs font-mono text-emerald-400/90 leading-relaxed">{JSON.stringify(VECTORS[selectedVectorKey], null, 2)}</pre></div>
              </div>
              <div className={`${card} overflow-hidden min-h-[250px] flex flex-col`}>
                <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2"><Activity className="w-4 h-4" />Sample Output (not a live run)</h3>
                  <span className="text-[10px] font-mono text-slate-500">{POLICY_TEST}</span>
                </div>
                <div className="p-4 bg-[#0a0a0c] flex-1 font-mono text-xs space-y-3">
                  {!hasRun ? <div className="text-slate-600">{'>'} Press "Replay sample output" to view the expected results.</div> : log.map((e) => (
                    <div key={e.id}>
                      <div className="flex flex-wrap items-start gap-2 mb-1">
                        <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] shrink-0 border ${e.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{e.status}</span>
                        <span className="text-slate-300 font-semibold">{e.test}</span>
                      </div>
                      <div className="text-slate-500 break-words leading-relaxed border-l border-slate-800/50 ml-2 pl-3">{e.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="max-w-4xl mx-auto">
            <div className={`${card} rounded-3xl p-6 sm:p-10`}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4"><Lock className="w-8 h-8 text-red-400" /></div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Owner Approval Gate</h2>
                <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">Before the skipped genuine-proof test can be enabled, these artifacts must be delivered, hashed, and signed off. Ticking a box here is a personal reminder. It is stored only in this browser tab and does not unlock anything.</p>
              </div>
              <div className="mb-8">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2"><span>Reviewer's own tracking</span><span className="text-indigo-400">{checked.size} / {CHECKLIST.length}</span></div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800"><div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${(checked.size / CHECKLIST.length) * 100}%` }} /></div>
              </div>
              <div className="space-y-4">
                {CHECKLIST.map((c, idx) => {
                  const on = checked.has(idx);
                  return (
                    <button key={idx} onClick={() => toggle(idx)} aria-pressed={on}
                      className={`w-full text-left p-5 rounded-2xl border transition-all flex items-start gap-4 ${on ? 'bg-emerald-950/10 border-emerald-500/30' : 'bg-slate-950/50 border-slate-800 hover:border-slate-600'}`}>
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${on ? 'bg-emerald-500 text-white' : 'bg-slate-800 border border-slate-700 text-slate-500'}`}>
                        {on ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                      </span>
                      <span className="flex-1">
                        <span className={`block text-sm sm:text-base font-bold ${on ? 'text-emerald-300' : 'text-slate-200'}`}>{c.step}</span>
                        <span className={`block text-xs sm:text-sm mt-1.5 leading-relaxed ${on ? 'text-emerald-100/60' : 'text-slate-400'}`}>{c.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 p-5 rounded-2xl border border-red-500/30 bg-red-950/20 text-center">
                <h4 className="text-base font-bold text-red-300 mb-1">Gate status: BLOCKED</h4>
                <p className="text-sm text-slate-400 max-w-lg mx-auto">The gate opens only after the owner signs off on real artifacts and an independent cryptographic review of the proofs. Nothing on this page can change that.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
