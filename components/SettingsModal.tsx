'use client';

import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { useTacticalTheme } from '../context/TacticalThemeContext';
import { useSecurityAccess, ClearanceLevel } from '../context/SecurityAccessContext';
import { useNodeDeck } from '../context/NodeDeckContext';
import { useTelemetry } from '../context/TelemetryContext';
import { useToast } from '../context/ToastContext';
import {
  X,
  Shield,
  FileDown,
  Check,
  Loader2,
  CloudUpload,
  LogIn,
  LogOut,
  Link2,
  ShieldCheck,
  ExternalLink,
  UserCheck,
} from 'lucide-react';
import { playTacticalAudio } from '../lib/tacticalAudio';
import {
  initAuth,
  googleSignIn,
  getAccessToken,
  logout as googleLogout,
} from '../lib/googleDriveAuth';
import type {
  DecorruptionCheckResult,
  GoogleDriveUploadResult,
} from '../lib/hyperbookDocExporter';

export type AppTheme = 'dark-tactical' | 'paper-white' | 'slate' | 'black' | 'white';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { audioEnabled, toggleAudio, theme, setTheme } = useTacticalTheme();
  const { clearance, setClearance } = useSecurityAccess();
  const { isGhostSearch, toggleGhostSearch, cards, sections } = useNodeDeck();
  const { clearHistory, totalNodesRead } = useTelemetry();
  const { addToast } = useToast();

  // Google Account & Drive OAuth state (flow-linked to Drive upload)
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  // .DOC Export, Triple-Check & Google Drive Upload state
  const [isExportingDoc, setIsExportingDoc] = useState<boolean>(false);
  const [isUploadingDrive, setIsUploadingDrive] = useState<boolean>(false);
  const [isRunningCheck, setIsRunningCheck] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] =
    useState<DecorruptionCheckResult | null>(null);
  const [driveUploadResult, setDriveUploadResult] =
    useState<GoogleDriveUploadResult | null>(null);
  const [lastExportStats, setLastExportStats] = useState<{
    nodeCount: number;
    kbSize: number;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
        setNeedsAuth(false);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const activeCategoryCount = sections.filter((s) => s.id !== 'all').length;
  const totalEquationsCount = cards.reduce(
    (acc, c) => acc + (c.equations?.length || 0),
    0
  );

  const handleGoogleLogin = async (): Promise<string | null> => {
    if (isSigningIn) return null;
    setIsSigningIn(true);
    playTacticalAudio('click');
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setAccessToken(result.accessToken);
        setNeedsAuth(false);
        addToast(
          'Google Account Connected',
          `Signed in as ${result.user.email || result.user.displayName || 'Authorized User'}. Flow linked to Google Drive export.`,
          'success'
        );
        return result.accessToken;
      }
      return null;
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      addToast(
        'Google Sign-In Cancelled or Failed',
        err?.message || 'Could not complete Google authentication.',
        'alert'
      );
      return null;
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    playTacticalAudio('click');
    try {
      await googleLogout();
      setGoogleUser(null);
      setAccessToken(null);
      setNeedsAuth(true);
      addToast('Signed Out', 'Disconnected Google account session.', 'info');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleRunTripleCheck = async () => {
    if (isRunningCheck) return;
    setIsRunningCheck(true);
    playTacticalAudio('click');
    try {
      const { generateHyperbookDocHtml, runDocDecorruptionTripleCheck } =
        await import('../lib/hyperbookDocExporter');
      const html = generateHyperbookDocHtml(cards, sections);
      const check = runDocDecorruptionTripleCheck(html, cards.length);
      setVerificationResult(check);
      if (check.passed) {
        addToast(
          'Decorruption Triple-Check Passed',
          `All 3 stages verified (${check.nodeCountVerified} nodes, ${check.kbSize} KB, Google Docs & Word compatible).`,
          'success'
        );
      } else {
        addToast(
          'Decorruption Check Warning',
          check.details.join(' | '),
          'warning'
        );
      }
    } catch (err) {
      console.error('Triple check failed:', err);
      addToast('Check Failed', 'Could not verify document integrity.', 'alert');
    } finally {
      setIsRunningCheck(false);
    }
  };

  const handleDownloadDoc = async () => {
    if (isExportingDoc) return;
    setIsExportingDoc(true);
    playTacticalAudio('confirm');
    try {
      const { downloadHyperbookDoc } = await import(
        '../lib/hyperbookDocExporter'
      );
      const result = downloadHyperbookDoc(cards, sections);
      const kbSize = Math.round(result.byteSize / 1024);
      setLastExportStats({ nodeCount: result.nodeCount, kbSize });
      setVerificationResult(result.verification);
      addToast(
        'Uncorrupted .DOC Downloaded',
        `${result.nodeCount} nodes (${kbSize} KB) verified across all 3 decorruption stages.`,
        'success'
      );
    } catch (err) {
      console.error('Failed to export .doc compendium:', err);
      addToast(
        'Export Failed',
        'Could not generate Hyperbook .doc file.',
        'alert'
      );
    } finally {
      setIsExportingDoc(false);
    }
  };

  const handleExportToGoogleDrive = async () => {
    if (isUploadingDrive) return;
    playTacticalAudio('confirm');

    // Flow-linked authentication: obtain token from memory or trigger Google Sign-In automatically
    let token = accessToken || (await getAccessToken());
    if (!token || needsAuth) {
      addToast(
        'Google Sign-In Required',
        'Initiating linked Google Account sign-in for Google Drive upload...',
        'info'
      );
      token = await handleGoogleLogin();
      if (!token) {
        setNeedsAuth(true);
        return;
      }
    }

    setIsUploadingDrive(true);
    try {
      const { uploadHyperbookToGoogleDrive } = await import(
        '../lib/hyperbookDocExporter'
      );
      const uploadRes = await uploadHyperbookToGoogleDrive(
        cards,
        sections,
        token
      );
      setDriveUploadResult(uploadRes);
      setVerificationResult(uploadRes.verification);
      addToast(
        'Exported & Verified in Google Docs',
        `Uploaded "${uploadRes.fileName}" and confirmed it opens cleanly in Google Docs.`,
        'success'
      );
    } catch (err: any) {
      console.error('Google Drive upload failed:', err);
      if (String(err?.message || '').includes('401')) {
        setNeedsAuth(true);
        setAccessToken(null);
      }
      addToast(
        'Google Drive Export Failed',
        err?.message || 'Could not upload document to Google Drive.',
        'alert'
      );
    } finally {
      setIsUploadingDrive(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-slate-700 bg-slate-950 p-6 text-slate-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-bold tracking-wider">
              SYSTEM CONFIGURATION
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Settings List */}
        <div className="space-y-4 text-xs">
          {/* ITEM 1: GOOGLE ACCOUNT SIGN-IN (FLOW LINKED TO DRIVE UPLOAD BELOW) */}
          <div className="p-3.5 rounded-lg bg-slate-900/95 border border-blue-800/70 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="font-bold text-blue-300 flex items-center gap-1.5 tracking-wide">
                  <UserCheck className="h-3.5 w-3.5 text-blue-400" />
                  <span>GOOGLE WORKSPACE ACCOUNT</span>
                </span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Flow-linked authentication for direct Google Drive &amp; Google Docs export
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  !needsAuth && googleUser
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {!needsAuth && googleUser ? 'LINKED & READY' : 'AUTH REQUIRED'}
              </span>
            </div>

            {!needsAuth && googleUser ? (
              <div className="flex items-center justify-between gap-2 p-2 rounded bg-slate-950/90 border border-slate-800">
                <div className="truncate">
                  <div className="font-bold text-slate-200 truncate">
                    {googleUser.displayName || 'Authorized Google Account'}
                  </div>
                  <div className="text-[10px] text-cyan-400 truncate">
                    {googleUser.email}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleLogout}
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-950/70 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-800 transition-colors text-[11px]"
                >
                  <LogOut className="h-3 w-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[10px] text-slate-400">
                  Sign in with Google to enable 1-click Drive &amp; Docs upload
                </span>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSigningIn}
                  className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded bg-white hover:bg-slate-100 text-slate-900 font-sans font-semibold text-xs shadow transition-colors disabled:opacity-60"
                >
                  {isSigningIn ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                  ) : (
                    <LogIn className="h-3.5 w-3.5 text-blue-600" />
                  )}
                  <span>{isSigningIn ? 'Signing in...' : 'Sign in with Google'}</span>
                </button>
              </div>
            )}

            {/* Visual Flow Link Bar connecting Google Account to .DOC & Drive Export Container below */}
            <div className="flex items-center justify-center gap-1.5 pt-1 border-t border-slate-800/80 text-[10px] text-blue-400">
              <Link2 className="h-3 w-3" />
              <span>FLOW LINKED TO HYPERBOOK .DOC &amp; GOOGLE DRIVE EXPORT BELOW</span>
            </div>
          </div>

          {/* ITEM 2: HYPERBOOK COMPLETE .DOC COMPENDIUM & GOOGLE DRIVE EXPORT */}
          <div className="p-3.5 rounded-lg bg-slate-900/90 border border-cyan-800/60 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-bold text-cyan-300 block tracking-wide">
                  HYPERBOOK FULL .DOC PRINTOUT &amp; GOOGLE DRIVE EXPORT
                </span>
                <span className="text-slate-400 text-[11px] block mt-0.5 leading-relaxed">
                  Uncorrupted Word (.doc) &amp; native Google Docs compendium of all {cards.length} nodes with top meta-analysis telemetry, SVG inserts, Roboto 6pt executive summary, vertical dividers, hyperlinked TOC, running header &amp; page numbers.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded bg-slate-950/80 border border-slate-800 p-2 text-center text-[10px]">
              <div className="border-r border-slate-800 pr-1">
                <span className="text-slate-500 block">NODES</span>
                <span className="font-bold text-cyan-300">{cards.length}</span>
              </div>
              <div className="border-r border-slate-800 pr-1">
                <span className="text-slate-500 block">CATEGORIES</span>
                <span className="font-bold text-slate-200">
                  {activeCategoryCount}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">EQUATIONS</span>
                <span className="font-bold text-emerald-300">
                  {totalEquationsCount}
                </span>
              </div>
            </div>

            {/* 3-Stage Decorruption Triple-Check Status */}
            <div className="rounded bg-slate-950/90 border border-slate-800 p-2.5 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>DECORRUPTION &amp; GOOGLE DOCS TRIPLE-CHECK</span>
                </span>
                <button
                  type="button"
                  onClick={handleRunTripleCheck}
                  disabled={isRunningCheck}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[10px] font-bold"
                >
                  {isRunningCheck ? 'Checking...' : 'Verify Integrity'}
                </button>
              </div>
              {verificationResult ? (
                <div className="space-y-0.5 text-[10px] text-slate-300">
                  {verificationResult.details.map((line, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[10px] text-slate-400">
                  Header: <strong className="text-slate-300">hyperbook by escaped innocent usa engineer</strong> &bull; Validated &lt;1.95 MB for Google Docs &amp; MS Word.
                </div>
              )}
            </div>

            {/* Verified Google Docs Open Link after Drive Upload */}
            {driveUploadResult && (
              <div className="p-2.5 rounded bg-emerald-950/50 border border-emerald-700/70 flex items-center justify-between gap-2">
                <div className="text-[10px] text-emerald-200">
                  <div className="font-bold flex items-center gap-1">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>
                      {driveUploadResult.verifiedOpenableInGoogleDocs
                        ? 'Google Docs Conversion Double-Checked & Verified'
                        : 'Uploaded to Google Drive'}
                    </span>
                  </div>
                  <div className="text-emerald-300/80 truncate">
                    {driveUploadResult.fileName}
                  </div>
                </div>
                <a
                  href={driveUploadResult.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                >
                  <span>Open in Google Docs</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* Action Buttons: Download Local .DOC + Export to Google Drive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadDoc}
                disabled={isExportingDoc}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors disabled:opacity-60"
              >
                {isExportingDoc ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileDown className="h-3.5 w-3.5" />
                )}
                <span>
                  {isExportingDoc
                    ? 'Generating .DOC...'
                    : lastExportStats
                    ? `Download .DOC (${lastExportStats.kbSize} KB)`
                    : 'Download .DOC Printout'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleExportToGoogleDrive}
                disabled={isUploadingDrive}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-60"
              >
                {isUploadingDrive ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CloudUpload className="h-3.5 w-3.5" />
                )}
                <span>
                  {isUploadingDrive
                    ? 'Uploading to Drive...'
                    : !needsAuth && googleUser
                    ? 'Export to Google Drive'
                    : 'Sign In & Export to Drive'}
                </span>
              </button>
            </div>
          </div>

          {/* Tactical Theme */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div>
              <span className="font-bold block">Theme Mode</span>
              <span className="text-slate-400 text-[11px]">
                Dark Tactical vs Paper White
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                playTacticalAudio('click');
                setTheme(
                  theme === 'paper-white' ? 'dark-tactical' : 'paper-white'
                );
              }}
              className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 hover:text-white"
            >
              {theme === 'paper-white' ? 'Paper White' : 'Dark Tactical'}
            </button>
          </div>

          {/* Tactical Audio */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div>
              <span className="font-bold block">Tactical Audio FX</span>
              <span className="text-slate-400 text-[11px]">
                Synthesized cyber-acoustic pings
              </span>
            </div>
            <button
              type="button"
              onClick={toggleAudio}
              className={`px-3 py-1 rounded font-bold border transition-colors ${
                audioEnabled
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {audioEnabled ? 'ENABLED' : 'MUTED'}
            </button>
          </div>

          {/* Ghost Search State */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div>
              <span className="font-bold block flex items-center gap-1.5">
                <span>Ghost Search Mode</span>
                {isGhostSearch && <span className="text-purple-400">👻</span>}
              </span>
              <span className="text-slate-400 text-[11px]">
                Cloak read telemetry &amp; apply serendipity RNG
              </span>
            </div>
            <button
              type="button"
              onClick={toggleGhostSearch}
              className={`px-3 py-1 rounded font-bold border transition-colors ${
                isGhostSearch
                  ? 'bg-purple-950 text-purple-300 border-purple-700'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {isGhostSearch ? 'ACTIVE' : 'OFF'}
            </button>
          </div>

          {/* Security Clearance */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold">Security Clearance</span>
              <span className="text-amber-400 font-bold">{clearance} // OMNISINGULARITY</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {(
                ['OMNICLEARANCE', 'TOP_SECRET', 'SECRET', 'UNCLASSIFIED'] as ClearanceLevel[]
              ).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    playTacticalAudio('click');
                    setClearance(lvl);
                  }}
                  className={`py-1 text-[10px] rounded border transition-colors ${
                    clearance === lvl
                      ? 'bg-amber-950 text-amber-300 border-amber-500 font-bold'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Telemetry Clear */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div>
              <span className="font-bold block">Telemetry History</span>
              <span className="text-slate-400 text-[11px]">
                {totalNodesRead} nodes logged in local storage
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                clearHistory();
                playTacticalAudio('click');
              }}
              className="px-2.5 py-1 rounded bg-rose-950/40 text-rose-300 border border-rose-900 hover:bg-rose-900/60"
            >
              Purge Trace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
