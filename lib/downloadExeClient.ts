export async function downloadStandaloneExeFile(): Promise<void> {
  const content = `# Generic Tactical Architecture Hyperbook - Standalone Command CLI
# Generated Standalone Node Specification & Client
VERSION=2.7.0
NODES=1050
STATUS=OPERATIONAL
`;
  const blob = new Blob([content], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Generic.exe';
  a.click();
  URL.revokeObjectURL(url);
}
