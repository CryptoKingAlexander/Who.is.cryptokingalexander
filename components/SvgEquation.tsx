'use client';

import React, { useMemo, useState } from 'react';
import katex from 'katex';
import { Copy, Check } from 'lucide-react';
import { playTacticalClick } from '../lib/tacticalAudio';

interface SvgEquationProps {
  formula: string;
  name?: string;
  equationNumber?: number | string;
  className?: string;
}

/**
 * Renders a display equation in formal Physics Journal / Computer Modern style (KaTeX_Main / KaTeX_Math),
 * complete with centered display typesetting, right-aligned physics equation numbering (1), (2), etc.,
 * and a compact 1-click Copy button.
 */
export function SvgEquation({
  formula,
  name,
  equationNumber,
  className = '',
}: SvgEquationProps) {
  const [copied, setCopied] = useState(false);

  const renderedHtml = useMemo(() => {
    try {
      return katex.renderToString(formula, {
        throwOnError: false,
        displayMode: true,
        strict: false,
      });
    } catch {
      return null;
    }
  }, [formula]);

  const handleCopyEquation = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTacticalClick();
    if (typeof window !== 'undefined' && navigator?.clipboard) {
      const textToCopy = name ? `${name}: ${formula}` : formula;
      navigator.clipboard.writeText(textToCopy).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div
      className={`physics-equation-container physics-font my-2 px-4 py-3 rounded-lg bg-[#090a07] border border-amber-500/30 shadow-inner ${className}`}
    >
      {name && (
        <div className="physics-font text-[13px] font-semibold italic text-amber-200/95 mb-1.5 tracking-normal">
          {name}
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 overflow-x-auto py-1 text-amber-50 text-[15px] leading-relaxed">
          {renderedHtml ? (
            <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
          ) : (
            <span className="physics-var-font text-amber-200 block overflow-x-auto whitespace-pre">
              {formula}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 pl-2">
          {equationNumber !== undefined && (
            <span className="physics-font text-sm italic text-amber-300/85 select-none">
              ({equationNumber})
            </span>
          )}
          <button
            type="button"
            onClick={handleCopyEquation}
            className="no-print flex items-center gap-1 px-2 py-0.5 rounded border border-amber-500/35 bg-stone-900/90 hover:bg-amber-950/70 text-[10px] font-mono not-italic font-bold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
            title="Copy equation LaTeX formula"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-2.5 h-2.5 text-amber-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders an inline mathematical variable symbol or asymptotic bound (e.g., \pi_\theta, \mathbf{O}_i, O(N \log N))
 * in authentic KaTeX_Math / Computer Modern italic physics notation.
 */
export function PhysicsVar({
  symbol,
  className = '',
}: {
  symbol: string;
  className?: string;
}) {
  const renderedHtml = useMemo(() => {
    if (!symbol) return null;
    try {
      return katex.renderToString(symbol.trim(), {
        throwOnError: false,
        displayMode: false,
        strict: false,
      });
    } catch {
      return null;
    }
  }, [symbol]);

  if (renderedHtml) {
    return (
      <span
        className={`physics-var-font inline-block align-baseline text-amber-200 ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  return <span className={`physics-var-font italic text-amber-200 ${className}`}>{symbol}</span>;
}

/**
 * Renders physics variable explanations or proof intuitions in Computer Modern serif (KaTeX_Main),
 * automatically typesetting any embedded LaTeX tokens (e.g., \mu, (\theta, \phi), y_i, x_i) via KaTeX.
 */
export function PhysicsText({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const renderedHtml = useMemo(() => {
    if (!text) return '';
    // Match parenthesized LaTeX like (\theta, \phi), backslash commands like \mu or \mathcal{X}, or subscripted/superscripted vars like y_i, x_i, w_opt
    const tokenRegex =
      /(\([\\a-zA-Z0-9_^{},\s]+\)|\\[a-zA-Z]+(?:\{[^{}]*\})*(?:_\{?[a-zA-Z0-9]+\}?|\^\{?[a-zA-Z0-9]+\}?)?|\b[a-zA-Z]_(?:\{[a-zA-Z0-9,]+\}|[a-zA-Z0-9]+)\b)/g;

    const parts = text.split(tokenRegex);
    return parts
      .map((part, idx) => {
        if (idx % 2 === 1) {
          try {
            return katex.renderToString(part, {
              throwOnError: false,
              displayMode: false,
              strict: false,
            });
          } catch {
            return `<span class="physics-var-font">${part}</span>`;
          }
        }
        return part
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      })
      .join('');
  }, [text]);

  return (
    <span
      className={`physics-font text-[13.5px] leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
