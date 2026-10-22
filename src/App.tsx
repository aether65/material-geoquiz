import { useState, useEffect, useCallback, useRef } from 'react';
import {
  type Question, type PlayerConfig, type AppSettings, DEFAULT_SETTINGS,
  PLAYER_COLORS, PLAYER_KEYS,
  ICONS, QUESTION_BANK,
  generateTalesQuestion, generateMetricsQuestion,
  SEED_PALETTES, t
} from './data';

// ---- Icon Component ----
function Icon({ name, size = 24, filled = false, className = '' }: { name: string; size?: number; filled?: boolean; className?: string }) {
  const path = ICONS[name];
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? 0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

// ---- Player Shape SVG ----
function PlayerShape({ shape, color, size = 32 }: { shape: number; color: string; size?: number }) {
  const shapes = [
    // Circle
    <circle key="c" cx={size/2} cy={size/2} r={size/2 - 2} fill={color} />,
    // Rounded square
    <rect key="r" x={2} y={2} width={size-4} height={size-4} rx={4} fill={color} />,
    // Blob
    <path key="b" d={`M${size/2} 2 C${size-2} 2 ${size-2} ${size/2} ${size-2} ${size/2} C${size-2} ${size-2} ${size/2} ${size-2} ${size/2} ${size-2} C2 ${size-2} 2 ${size/2} 2 ${size/2} C2 2 ${size/2} 2 ${size/2} 2`} fill={color} />,
    // Flower
    <g key="f">
      <circle cx={size/2} cy={size/4} r={size/5} fill={color} />
      <circle cx={size*3/4} cy={size/2} r={size/5} fill={color} />
      <circle cx={size/2} cy={size*3/4} r={size/5} fill={color} />
      <circle cx={size/4} cy={size/2} r={size/5} fill={color} />
      <circle cx={size/2} cy={size/2} r={size/5} fill={color} />
    </g>,
  ];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="score-shape" aria-hidden="true">
      {shapes[shape % shapes.length]}
    </svg>
  );
}

// ---- SVG Figures - Utility Functions ----

// Cores com fallback para quando variáveis CSS não existem (relatório exportado)
const FIG_COLORS = {
  stroke: 'var(--md-sys-color-on-surface, #1b1b1f)',
  primary: 'var(--md-sys-color-primary, #6750a4)',
  tertiary: 'var(--md-sys-color-tertiary, #7d5260)',
  surface: 'var(--md-sys-color-surface-container-low, #f7f2fa)',
  label: 'var(--md-sys-color-on-surface, #1b1b1f)',
};

// Valida parâmetros numéricos
function validateNum(val: any, fallback = 0): number {
  const n = Number(val);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

// Marcador de ângulo reto como path (calculado a partir do vértice e dois pontos)
function marcadorAnguloReto(vx: number, vy: number, ax: number, ay: number, bx: number, by: number, size = 14): string {
  // Vetores unitários dos dois lados a partir do vértice
  const lenA = Math.sqrt((ax - vx) ** 2 + (ay - vy) ** 2);
  const lenB = Math.sqrt((bx - vx) ** 2 + (by - vy) ** 2);
  if (lenA === 0 || lenB === 0) return '';
  const uax = (ax - vx) / lenA;
  const uay = (ay - vy) / lenA;
  const ubx = (bx - vx) / lenB;
  const uby = (by - vy) / lenB;
  // Três pontos do marcador
  const p1x = vx + uax * size;
  const p1y = vy + uay * size;
  const p2x = vx + uax * size + ubx * size;
  const p2y = vy + uay * size + uby * size;
  const p3x = vx + ubx * size;
  const p3y = vy + uby * size;
  return `M ${p1x} ${p1y} L ${p2x} ${p2y} L ${p3x} ${p3y}`;
}

// Clampa posição dentro do viewBox com margem
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// ViewBox fixo para todas as figuras
const VB_W = 400;
const VB_H = 300;
const MARGIN = 40;

// ---- SVG Figures ----
function drawRightTriangle(params: Record<string, any>): JSX.Element {
  const b = validateNum(params.b, 6);
  const c = validateNum(params.c, 8);
  const a = params.a !== null && params.a !== undefined ? validateNum(params.a, Math.sqrt(b * b + c * c)) : null;
  const h = params.h !== null && params.h !== undefined ? validateNum(params.h, 0) : null;
  const m = params.m !== null && params.m !== undefined ? validateNum(params.m, 0) : null;
  const n = params.n !== null && params.n !== undefined ? validateNum(params.n, 0) : null;
  const unit = params.unit || '';

  // Calcular hipotenusa se não fornecida
  const aCalc = a || Math.sqrt(b * b + c * c);

  // Escalar para caber no viewBox com margem
  const drawW = VB_W - 2 * MARGIN - 60; // espaço para rótulos
  const drawH = VB_H - 2 * MARGIN - 40;
  const scale = Math.min(drawW / c, drawH / b);
  const scaledB = b * scale;
  const scaledC = c * scale;

  // Vértices do triângulo (ângulo reto no canto inferior esquerdo)
  const vx = MARGIN + 40; // vértice do ângulo reto
  const vy = VB_H - MARGIN - 20;
  const ax = vx + scaledC; // fim do cateto c (horizontal)
  const ay = vy;
  const bx = vx; // topo do cateto b (vertical)
  const by = vy - scaledB;

  // Ponto da altura na hipotenusa
  const mCalc = m || (b * b) / aCalc;
  const hx = vx + (mCalc / aCalc) * scaledC;
  const hy = vy - (mCalc / aCalc) * scaledB;

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label={params.ariaLabel || 'Triângulo retângulo'}>
      {/* Triângulo */}
      <polygon
        points={`${vx},${vy} ${ax},${ay} ${bx},${by}`}
        fill="none"
        stroke={FIG_COLORS.stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Marcador de ângulo reto */}
      <path
        d={marcadorAnguloReto(vx, vy, ax, ay, bx, by, 14)}
        fill="none"
        stroke={FIG_COLORS.stroke}
        strokeWidth="1.5"
      />
      {/* Altura (se aplicável) */}
      {h !== null && h > 0 && (
        <g>
          <line
            x1={hx} y1={hy}
            x2={vx} y2={vy}
            stroke={FIG_COLORS.primary}
            strokeWidth="2"
            strokeDasharray="6 3"
          />
          {/* Marcador de ângulo reto na altura */}
          <text
            x={clamp(hx + 8, MARGIN, VB_W - MARGIN)}
            y={clamp((hy + vy) / 2, MARGIN, VB_H - MARGIN)}
            textAnchor="start"
            dominantBaseline="middle"
            fontSize="15"
            fontWeight="700"
            fill={FIG_COLORS.primary}
            paintOrder="stroke"
            stroke={FIG_COLORS.surface}
            strokeWidth="3"
          >
            h = {h} {unit}
          </text>
        </g>
      )}
      {/* Rótulo cateto c (base) */}
      <text
        x={(vx + ax) / 2}
        y={vy + 22}
        textAnchor="middle"
        dominantBaseline="hanging"
        fontSize="15"
        fontWeight="700"
        fill={FIG_COLORS.label}
        paintOrder="stroke"
        stroke={FIG_COLORS.surface}
        strokeWidth="3"
      >
        c = {params.c !== null && params.c !== undefined ? `${c} ${unit}` : '?'}
      </text>
      {/* Rótulo cateto b (vertical) */}
      <text
        x={vx - 18}
        y={(vy + by) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="15"
        fontWeight="700"
        fill={FIG_COLORS.label}
        paintOrder="stroke"
        stroke={FIG_COLORS.surface}
        strokeWidth="3"
        transform={`rotate(-90, ${vx - 18}, ${(vy + by) / 2})`}
      >
        b = {params.b !== null && params.b !== undefined ? `${b} ${unit}` : '?'}
      </text>
      {/* Rótulo hipotenusa */}
      <text
        x={(ax + bx) / 2 + 16}
        y={(ay + by) / 2 - 8}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="15"
        fontWeight="700"
        fill={FIG_COLORS.primary}
        paintOrder="stroke"
        stroke={FIG_COLORS.surface}
        strokeWidth="3"
      >
        a = {a !== null ? `${a} ${unit}` : '?'}
      </text>
      {/* Projeções (se aplicável) */}
      {m !== null && m > 0 && h !== null && h > 0 && (
        <g>
          <text
            x={(vx + hx) / 2}
            y={vy + 40}
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill={FIG_COLORS.tertiary}
            paintOrder="stroke"
            stroke={FIG_COLORS.surface}
            strokeWidth="3"
          >
            m = {m} {unit}
          </text>
          {n !== null && n > 0 && (
            <text
              x={(hx + ax) / 2}
              y={vy + 40}
              textAnchor="middle"
              fontSize="12"
              fontWeight="600"
              fill={FIG_COLORS.tertiary}
              paintOrder="stroke"
              stroke={FIG_COLORS.surface}
              strokeWidth="3"
            >
              n = {n} {unit}
            </text>
          )}
        </g>
      )}
    </svg>
  );
}

function drawTales(params: Record<string, any>): JSX.Element {
  const segments1 = Array.isArray(params.segments1) ? params.segments1 : [4, 6];
  const segments2 = Array.isArray(params.segments2) ? params.segments2 : [8, null];
  const unit = params.unit || '';

  const total1 = segments1.reduce((a: number, b: number) => a + b, 0);
  const maxSeg = Math.max(...segments1.filter((s: number) => s > 0), 1);

  // Escalar para caber no viewBox
  const drawW = VB_W - 2 * MARGIN - 40;
  const scale = drawW / total1;

  const y1 = 100; // reta paralela superior
  const y2 = 210; // reta paralela inferior
  const x0 = MARGIN + 20;

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label={params.ariaLabel || 'Retas paralelas cortadas por transversais'}>
      {/* Retas paralelas */}
      <line x1={x0 - 10} y1={y1} x2={x0 + total1 * scale + 10} y2={y1} stroke={FIG_COLORS.stroke} strokeWidth="3" strokeLinecap="round" />
      <line x1={x0 - 10} y1={y2} x2={x0 + total1 * scale + 10} y2={y2} stroke={FIG_COLORS.stroke} strokeWidth="3" strokeLinecap="round" />
      {/* Transversais */}
      <line x1={x0} y1={y1 - 30} x2={x0} y2={y2 + 30} stroke={FIG_COLORS.stroke} strokeWidth="1.5" strokeDasharray="6 3" />
      <line x1={x0 + total1 * scale} y1={y1 - 30} x2={x0 + total1 * scale} y2={y2 + 30} stroke={FIG_COLORS.stroke} strokeWidth="1.5" strokeDasharray="6 3" />
      {/* Transversal intermediária se houver mais de 1 segmento */}
      {segments1.length > 1 && segments1.slice(0, -1).map((_: number, i: number) => {
        const sx = x0 + segments1.slice(0, i + 1).reduce((a: number, b: number) => a + b, 0) * scale;
        return (
          <line key={`t-${i}`} x1={sx} y1={y1 - 20} x2={sx} y2={y2 + 20} stroke={FIG_COLORS.stroke} strokeWidth="1.5" strokeDasharray="6 3" />
        );
      })}
      {/* Marcadores de segmento na linha 1 */}
      {segments1.map((seg: number, i: number) => {
        const sx = x0 + segments1.slice(0, i).reduce((a: number, b: number) => a + b, 0) * scale;
        const ex = sx + seg * scale;
        return (
          <g key={`s1-${i}`}>
            {/* Linhas de cota verticais */}
            <line x1={sx} y1={y1 - 8} x2={sx} y2={y1 + 8} stroke={FIG_COLORS.stroke} strokeWidth="2" />
            <line x1={ex} y1={y1 - 8} x2={ex} y2={y1 + 8} stroke={FIG_COLORS.stroke} strokeWidth="2" />
            {/* Linha de cota horizontal */}
            <line x1={sx} y1={y1 - 18} x2={ex} y2={y1 - 18} stroke={FIG_COLORS.stroke} strokeWidth="1" />
            {/* Rótulo */}
            <text
              x={(sx + ex) / 2}
              y={y1 - 28}
              textAnchor="middle"
              dominantBaseline="auto"
              fontSize="15"
              fontWeight="700"
              fill={FIG_COLORS.label}
              paintOrder="stroke"
              stroke={FIG_COLORS.surface}
              strokeWidth="3"
            >
              {seg} {unit}
            </text>
          </g>
        );
      })}
      {/* Marcadores de segmento na linha 2 */}
      {segments2.map((seg: number | null, i: number) => {
        const sx = x0 + (segments2.slice(0, i) as (number | null)[]).reduce((a: number, b: number | null) => a + (b || 0), 0) * scale;
        const segVal = seg || 0;
        const ex = sx + segVal * scale;
        const isUnknown = seg === null;
        return (
          <g key={`s2-${i}`}>
            <line x1={sx} y1={y2 - 8} x2={sx} y2={y2 + 8} stroke={FIG_COLORS.stroke} strokeWidth="2" />
            {seg !== null && <line x1={ex} y1={y2 - 8} x2={ex} y2={y2 + 8} stroke={FIG_COLORS.stroke} strokeWidth="2" />}
            {/* Linha de cota */}
            <line x1={sx} y1={y2 + 18} x2={isUnknown ? sx + 50 : ex} y2={y2 + 18} stroke={FIG_COLORS.stroke} strokeWidth="1" />
            {/* Rótulo */}
            <text
              x={isUnknown ? sx + 25 : (sx + ex) / 2}
              y={y2 + 38}
              textAnchor="middle"
              dominantBaseline="hanging"
              fontSize="15"
              fontWeight="700"
              fill={isUnknown ? FIG_COLORS.primary : FIG_COLORS.label}
              paintOrder="stroke"
              stroke={FIG_COLORS.surface}
              strokeWidth="3"
            >
              {isUnknown ? 'x = ?' : `${seg} ${unit}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Figura de postes alinhados (questão dos 3 postes)
function drawPostes(params: Record<string, any>): JSX.Element {
  const segments = Array.isArray(params.segments) ? params.segments : [15, 15];
  const unit = params.unit || '';
  const total = segments.reduce((a: number, b: number) => a + b, 0);
  const numPostes = segments.length + 1;

  const drawW = VB_W - 2 * MARGIN - 60;
  const scale = drawW / total;
  const x0 = MARGIN + 30;
  const y = 160; // linha do chão

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label={params.ariaLabel || 'Postes alinhados na rua'}>
      {/* Rua (linha horizontal) */}
      <line x1={x0 - 20} y1={y} x2={x0 + total * scale + 20} y2={y} stroke={FIG_COLORS.stroke} strokeWidth="3" strokeLinecap="round" />
      {/* Postes */}
      {Array.from({ length: numPostes }).map((_, i) => {
        const px = x0 + (i < segments.length ? segments.slice(0, i).reduce((a: number, b: number) => a + b, 0) : total) * scale;
        return (
          <g key={`poste-${i}`}>
            {/* Poste */}
            <line x1={px} y1={y} x2={px} y2={y - 60} stroke={FIG_COLORS.stroke} strokeWidth="4" strokeLinecap="round" />
            {/* Lâmpada */}
            <circle cx={px} cy={y - 65} r="6" fill={FIG_COLORS.primary} stroke={FIG_COLORS.stroke} strokeWidth="1.5" />
            {/* Base */}
            <line x1={px - 8} y1={y + 3} x2={px + 8} y2={y + 3} stroke={FIG_COLORS.stroke} strokeWidth="2" />
          </g>
        );
      })}
      {/* Cotas dos segmentos */}
      {segments.map((seg: number, i: number) => {
        const sx = x0 + segments.slice(0, i).reduce((a: number, b: number) => a + b, 0) * scale;
        const ex = sx + seg * scale;
        return (
          <g key={`cota-${i}`}>
            {/* Linhas de cota */}
            <line x1={sx} y1={y + 15} x2={sx} y2={y + 35} stroke={FIG_COLORS.stroke} strokeWidth="1" />
            <line x1={ex} y1={y + 15} x2={ex} y2={y + 35} stroke={FIG_COLORS.stroke} strokeWidth="1" />
            {/* Linha horizontal da cota */}
            <line x1={sx + 4} y1={y + 25} x2={ex - 4} y2={y + 25} stroke={FIG_COLORS.stroke} strokeWidth="1.5" />
            {/* Setas */}
            <polygon points={`${sx + 4},${y + 25} ${sx + 10},${y + 22} ${sx + 10},${y + 28}`} fill={FIG_COLORS.stroke} />
            <polygon points={`${ex - 4},${y + 25} ${ex - 10},${y + 22} ${ex - 10},${y + 28}`} fill={FIG_COLORS.stroke} />
            {/* Rótulo */}
            <text
              x={(sx + ex) / 2}
              y={y + 48}
              textAnchor="middle"
              dominantBaseline="hanging"
              fontSize="15"
              fontWeight="700"
              fill={FIG_COLORS.label}
              paintOrder="stroke"
              stroke={FIG_COLORS.surface}
              strokeWidth="3"
            >
              {seg} {unit}
            </text>
          </g>
        );
      })}
      {/* Cota total (incógnita) */}
      <g>
        <line x1={x0} y1={y + 70} x2={x0} y2={y + 90} stroke={FIG_COLORS.primary} strokeWidth="1" />
        <line x1={x0 + total * scale} y1={y + 70} x2={x0 + total * scale} y2={y + 90} stroke={FIG_COLORS.primary} strokeWidth="1" />
        <line x1={x0 + 4} y1={y + 80} x2={x0 + total * scale - 4} y2={y + 80} stroke={FIG_COLORS.primary} strokeWidth="1.5" />
        <text
          x={x0 + (total * scale) / 2}
          y={y + 100}
          textAnchor="middle"
          dominantBaseline="hanging"
          fontSize="16"
          fontWeight="700"
          fill={FIG_COLORS.primary}
          paintOrder="stroke"
          stroke={FIG_COLORS.surface}
          strokeWidth="3"
        >
          distância total = ?
        </text>
      </g>
    </svg>
  );
}

function LadderFigure({ params }: { params: Record<string, any> }) {
  const hyp = validateNum(params.hypotenuse, 5);
  const base = validateNum(params.base, 3);
  const height = params.height !== null && params.height !== undefined ? validateNum(params.height, 0) : null;
  const unit = params.unit || '';

  // Calcular altura se não fornecida
  const hCalc = height || Math.sqrt(hyp * hyp - base * base);

  // Escalar para caber no viewBox
  const drawW = VB_W - 2 * MARGIN - 80;
  const drawH = VB_H - 2 * MARGIN - 40;
  const scale = Math.min(drawW / base, drawH / hCalc);
  const scaledBase = base * scale;
  const scaledH = hCalc * scale;

  // Vértices
  const wallX = MARGIN + 40;
  const groundY = VB_H - MARGIN - 20;
  const topY = groundY - scaledH;
  const footX = wallX + scaledBase;

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label="Escada apoiada na parede">
      {/* Parede */}
      <line x1={wallX} y1={MARGIN} x2={wallX} y2={groundY + 5} stroke={FIG_COLORS.stroke} strokeWidth="4" strokeLinecap="round" />
      {/* Chão */}
      <line x1={wallX - 5} y1={groundY} x2={footX + 30} y2={groundY} stroke={FIG_COLORS.stroke} strokeWidth="3" strokeLinecap="round" />
      {/* Escada (hipotenusa) */}
      <line x1={wallX} y1={topY} x2={footX} y2={groundY} stroke={FIG_COLORS.primary} strokeWidth="4" strokeLinecap="round" />
      {/* Degraus da escada */}
      {Array.from({ length: 5 }).map((_, i) => {
        const t = (i + 1) / 6;
        const sx = wallX + (footX - wallX) * t;
        const sy = topY + (groundY - topY) * t;
        return (
          <line key={i} x1={sx - 6} y1={sy} x2={sx + 6} y2={sy} stroke={FIG_COLORS.primary} strokeWidth="2" />
        );
      })}
      {/* Marcador de ângulo reto */}
      <path
        d={marcadorAnguloReto(wallX, groundY, footX, groundY, wallX, topY, 14)}
        fill="none"
        stroke={FIG_COLORS.stroke}
        strokeWidth="1.5"
      />
      {/* Rótulo escada */}
      <text
        x={(wallX + footX) / 2 + 18}
        y={(topY + groundY) / 2 - 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="15"
        fontWeight="700"
        fill={FIG_COLORS.primary}
        paintOrder="stroke"
        stroke={FIG_COLORS.surface}
        strokeWidth="3"
        transform={`rotate(${Math.atan2(groundY - topY, footX - wallX) * -180 / Math.PI}, ${(wallX + footX) / 2 + 18}, ${(topY + groundY) / 2 - 10})`}
      >
        {hyp} {unit}
      </text>
      {/* Rótulo base */}
      <text
        x={(wallX + footX) / 2}
        y={groundY + 22}
        textAnchor="middle"
        dominantBaseline="hanging"
        fontSize="15"
        fontWeight="700"
        fill={FIG_COLORS.label}
        paintOrder="stroke"
        stroke={FIG_COLORS.surface}
        strokeWidth="3"
      >
        {base} {unit}
      </text>
      {/* Rótulo altura */}
      <text
        x={wallX - 20}
        y={(topY + groundY) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="15"
        fontWeight="700"
        fill={FIG_COLORS.tertiary}
        paintOrder="stroke"
        stroke={FIG_COLORS.surface}
        strokeWidth="3"
        transform={`rotate(-90, ${wallX - 20}, ${(topY + groundY) / 2})`}
      >
        {height !== null ? `h = ${height} ${unit}` : 'h = ?'}
      </text>
    </svg>
  );
}

function TriangleWithParallel({ params }: { params: Record<string, any> }) {
  const AD = validateNum(params.AD, 5);
  const DB = validateNum(params.DB, 3);
  const BC = validateNum(params.BC, 12);
  const DE = params.DE !== null && params.DE !== undefined ? params.DE : null;
  const unit = params.unit || '';
  const AB = AD + DB;
  const ratio = AD / AB;

  // Triângulo ABC
  const Ax = VB_W / 2;
  const Ay = MARGIN + 20;
  const Bx = MARGIN + 40;
  const By = VB_H - MARGIN - 30;
  const Cx = VB_W - MARGIN - 40;
  const Cy = By;

  // Pontos D e E
  const Dx = Bx + (Ax - Bx) * ratio;
  const Dy = By + (Ay - By) * ratio;
  const Ex = Cx + (Ax - Cx) * ratio;
  const Ey = Cy + (Ay - Cy) * ratio;

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label="Triângulo com segmento paralelo">
      {/* Triângulo ABC */}
      <polygon
        points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`}
        fill="none"
        stroke={FIG_COLORS.stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Linha paralela DE */}
      <line x1={Dx} y1={Dy} x2={Ex} y2={Ey} stroke={FIG_COLORS.primary} strokeWidth="3" strokeDasharray="8 4" />
      {/* Rótulos dos vértices */}
      <text x={Ax} y={Ay - 10} textAnchor="middle" fontSize="16" fontWeight="700" fill={FIG_COLORS.label}>A</text>
      <text x={Bx - 15} y={By + 5} textAnchor="middle" fontSize="16" fontWeight="700" fill={FIG_COLORS.label}>B</text>
      <text x={Cx + 15} y={Cy + 5} textAnchor="middle" fontSize="16" fontWeight="700" fill={FIG_COLORS.label}>C</text>
      <text x={Dx - 15} y={Dy + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={FIG_COLORS.label}>D</text>
      <text x={Ex + 15} y={Ey + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={FIG_COLORS.label}>E</text>
      {/* Cota AD */}
      <text
        x={(Bx + Dx) / 2 - 20}
        y={(By + Dy) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="14"
        fontWeight="700"
        fill={FIG_COLORS.label}
        paintOrder="stroke"
        stroke={FIG_COLORS.surface}
        strokeWidth="3"
      >
        {AD} {unit}
      </text>
      {/* Cota DB */}
      <text
        x={(Dx + Ax) / 2 - 20}
        y={(Dy + Ay) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="14"
        fontWeight="700"
        fill={FIG_COLORS.label}
        paintOrder="stroke"
        stroke={FIG_COLORS.surface}
        strokeWidth="3"
      >
        {DB} {unit}
      </text>
      {/* Cota BC */}
      <text
        x={(Bx + Cx) / 2}
        y={By + 22}
        textAnchor="middle"
        dominantBaseline="hanging"
        fontSize="14"
        fontWeight="700"
        fill={FIG_COLORS.label}
        paintOrder="stroke"
        stroke={FIG_COLORS.surface}
        strokeWidth="3"
      >
        BC = {BC} {unit}
      </text>
      {/* Cota DE */}
      <text
        x={(Dx + Ex) / 2}
        y={(Dy + Ey) / 2 - 14}
        textAnchor="middle"
        dominantBaseline="auto"
        fontSize="15"
        fontWeight="700"
        fill={FIG_COLORS.primary}
        paintOrder="stroke"
        stroke={FIG_COLORS.surface}
        strokeWidth="3"
      >
        DE = {DE !== null ? `${DE} ${unit}` : '?'}
      </text>
    </svg>
  );
}

// Figura de rampa
function drawRamp(params: Record<string, any>): JSX.Element {
  const rampLength = validateNum(params.rampLength, 10);
  const distance = validateNum(params.distance, 4);
  const heightAt = validateNum(params.heightAt, 2.4);
  const totalHeight = params.totalHeight !== null && params.totalHeight !== undefined ? params.totalHeight : null;
  const unit = params.unit || '';

  const drawW = VB_W - 2 * MARGIN - 60;
  const drawH = VB_H - 2 * MARGIN - 40;
  const scale = drawW / rampLength;

  const x0 = MARGIN + 30;
  const y0 = VB_H - MARGIN - 20;
  const angle = Math.asin(Math.min(heightAt / distance, 1));
  const endX = x0 + rampLength * scale * Math.cos(angle);
  const endY = y0 - rampLength * scale * Math.sin(angle);
  const midX = x0 + distance * scale * Math.cos(angle);
  const midY = y0 - distance * scale * Math.sin(angle);

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label="Rampa inclinada">
      {/* Chão */}
      <line x1={x0 - 10} y1={y0} x2={endX + 30} y2={y0} stroke={FIG_COLORS.stroke} strokeWidth="2" />
      {/* Rampa */}
      <line x1={x0} y1={y0} x2={endX} y2={endY} stroke={FIG_COLORS.stroke} strokeWidth="3" strokeLinecap="round" />
      {/* Altura parcial */}
      <line x1={midX} y1={midY} x2={midX} y2={y0} stroke={FIG_COLORS.primary} strokeWidth="2" strokeDasharray="6 3" />
      {/* Altura total (edifício) */}
      <line x1={endX} y1={endY} x2={endX} y2={y0} stroke={FIG_COLORS.tertiary} strokeWidth="3" />
      {/* Marcador de ângulo reto na base */}
      <path d={marcadorAnguloReto(endX, y0, x0, y0, endX, endY, 12)} fill="none" stroke={FIG_COLORS.stroke} strokeWidth="1.5" />
      {/* Rótulos */}
      <text x={(x0 + endX) / 2} y={(y0 + endY) / 2 - 12} textAnchor="middle" fontSize="14" fontWeight="700" fill={FIG_COLORS.label} paintOrder="stroke" stroke={FIG_COLORS.surface} strokeWidth="3">
        {rampLength} {unit}
      </text>
      <text x={(x0 + midX) / 2} y={y0 + 20} textAnchor="middle" fontSize="13" fontWeight="600" fill={FIG_COLORS.label} paintOrder="stroke" stroke={FIG_COLORS.surface} strokeWidth="3">
        {distance} {unit}
      </text>
      <text x={midX + 15} y={(midY + y0) / 2} textAnchor="start" dominantBaseline="middle" fontSize="14" fontWeight="700" fill={FIG_COLORS.primary} paintOrder="stroke" stroke={FIG_COLORS.surface} strokeWidth="3">
        {heightAt} {unit}
      </text>
      <text x={endX + 15} y={(endY + y0) / 2} textAnchor="start" dominantBaseline="middle" fontSize="15" fontWeight="700" fill={FIG_COLORS.tertiary} paintOrder="stroke" stroke={FIG_COLORS.surface} strokeWidth="3">
        h = {totalHeight !== null ? `${totalHeight} ${unit}` : '?'}
      </text>
    </svg>
  );
}

function QuestionFigure({ question }: { question: Question }) {
  const { figureParams } = question;
  const type = figureParams.type;

  // Validação: se figureParams não existe ou type não é reconhecido, mostra mensagem
  if (!figureParams || !type) {
    return (
      <div className="question-figure question-figure-unavailable">
        <Icon name="alert" size={32} />
        <span>Figura indisponível</span>
      </div>
    );
  }

  // Handler por tipo de figura
  switch (type) {
    case 'tales':
    case 'tales-4parallel':
    case 'tales-parallel':
      return <div className="question-figure">{drawTales(figureParams)}</div>;

    case 'tales-linear':
      return <div className="question-figure">{drawPostes(figureParams)}</div>;

    case 'tales-shadow':
      return <div className="question-figure">{drawShadow(figureParams)}</div>;

    case 'tales-triangle':
    case 'tales-triangle-parallel':
      return <div className="question-figure"><TriangleWithParallel params={figureParams} /></div>;

    case 'tales-ramp':
      return <div className="question-figure">{drawRamp(figureParams)}</div>;

    case 'tales-scale':
      return <div className="question-figure">{drawScale(figureParams)}</div>;

    case 'ladder':
    case 'cable':
      return <div className="question-figure"><LadderFigure params={type === 'cable' ? { ...figureParams, hypotenuse: figureParams.cable, base: figureParams.base, height: null } : figureParams} /></div>;

    case 'square-diagonal':
      return <div className="question-figure">{drawSquareDiagonal(figureParams)}</div>;

    case 'right-triangle':
    case 'right-triangle-height':
    case 'right-triangle-proj':
    case 'right-triangle-find-a':
    case 'right-triangle-both-proj':
    case 'right-triangle-ratio':
    case 'right-triangle-product':
      return <div className="question-figure">{drawRightTriangle(figureParams)}</div>;

    default:
      // Tipo não reconhecido - tenta como triângulo retângulo se tiver parâmetros compatíveis
      if (figureParams.b !== undefined || figureParams.c !== undefined) {
        return <div className="question-figure">{drawRightTriangle(figureParams)}</div>;
      }
      return (
        <div className="question-figure question-figure-unavailable">
          <Icon name="alert" size={32} />
          <span>Figura indisponível para este tipo de questão</span>
        </div>
      );
  }
}

// Figura de sombra (prédio e pessoa)
function drawShadow(params: Record<string, any>): JSX.Element {
  const shadow1 = validateNum(params.shadow1, 12);
  const person = validateNum(params.person, 1.8);
  const shadow2 = validateNum(params.shadow2, 2.4);
  const building = params.building !== null && params.building !== undefined ? params.building : null;
  const unit = params.unit || '';

  // Escalar para caber
  const maxShadow = Math.max(shadow1, shadow2 + 4);
  const scale = (VB_W - 2 * MARGIN - 80) / maxShadow;
  const heightScale = (VB_H - 2 * MARGIN - 60) / (shadow1 * 0.8);

  const groundY = VB_H - MARGIN - 20;
  const buildingX = MARGIN + 40;
  const buildingW = 30;
  const buildingH = shadow1 * heightScale * 0.7;
  const personX = buildingX + buildingW + shadow2 * scale + 30;
  const personH = person * heightScale * 0.7;

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label="Sombra do prédio e da pessoa">
      {/* Chão */}
      <line x1={MARGIN} y1={groundY} x2={VB_W - MARGIN} y2={groundY} stroke={FIG_COLORS.stroke} strokeWidth="2" />
      {/* Prédio */}
      <rect x={buildingX} y={groundY - buildingH} width={buildingW} height={buildingH} fill="none" stroke={FIG_COLORS.stroke} strokeWidth="2.5" />
      {/* Sombra do prédio */}
      <line x1={buildingX + buildingW} y1={groundY} x2={buildingX + buildingW + shadow1 * scale} y2={groundY} stroke={FIG_COLORS.stroke} strokeWidth="2" strokeDasharray="6 3" />
      {/* Raio solar do prédio */}
      <line x1={buildingX + buildingW / 2} y1={groundY - buildingH} x2={buildingX + buildingW + shadow1 * scale} y2={groundY} stroke={FIG_COLORS.stroke} strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />
      {/* Pessoa */}
      <line x1={personX} y1={groundY} x2={personX} y2={groundY - personH} stroke={FIG_COLORS.stroke} strokeWidth="3" />
      <circle cx={personX} cy={groundY - personH - 8} r="8" fill={FIG_COLORS.stroke} />
      {/* Sombra da pessoa */}
      <line x1={personX} y1={groundY} x2={personX + shadow2 * scale} y2={groundY} stroke={FIG_COLORS.stroke} strokeWidth="2" strokeDasharray="6 3" />
      {/* Raio solar da pessoa */}
      <line x1={personX} y1={groundY - personH - 5} x2={personX + shadow2 * scale} y2={groundY} stroke={FIG_COLORS.stroke} strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />
      {/* Rótulos */}
      <text x={buildingX + buildingW / 2} y={groundY - buildingH - 12} textAnchor="middle" fontSize="15" fontWeight="700" fill={FIG_COLORS.primary} paintOrder="stroke" stroke={FIG_COLORS.surface} strokeWidth="3">
        h = {building !== null ? `${building} ${unit}` : '?'}
      </text>
      <text x={buildingX + buildingW + (shadow1 * scale) / 2} y={groundY + 20} textAnchor="middle" fontSize="13" fontWeight="600" fill={FIG_COLORS.label} paintOrder="stroke" stroke={FIG_COLORS.surface} strokeWidth="3">
        {shadow1} {unit}
      </text>
      <text x={personX + 20} y={groundY - personH / 2} textAnchor="start" dominantBaseline="middle" fontSize="13" fontWeight="700" fill={FIG_COLORS.label} paintOrder="stroke" stroke={FIG_COLORS.surface} strokeWidth="3">
        {person} m
      </text>
      <text x={personX + (shadow2 * scale) / 2} y={groundY + 20} textAnchor="middle" fontSize="13" fontWeight="600" fill={FIG_COLORS.label} paintOrder="stroke" stroke={FIG_COLORS.surface} strokeWidth="3">
        {shadow2} m
      </text>
    </svg>
  );
}

// Figura de escala
function drawScale(params: Record<string, any>): JSX.Element {
  const mapDist = validateNum(params.mapDist, 6);
  const scaleVal = validateNum(params.scale, 500);
  const unit = params.unit || 'cm';

  const lineW = VB_W - 2 * MARGIN - 80;
  const x0 = MARGIN + 40;
  const y = VB_H / 2;

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label="Escala do mapa">
      {/* Linha do mapa */}
      <line x1={x0} y1={y} x2={x0 + lineW} y2={y} stroke={FIG_COLORS.stroke} strokeWidth="3" strokeLinecap="round" />
      {/* Marcadores nas extremidades */}
      <line x1={x0} y1={y - 15} x2={x0} y2={y + 15} stroke={FIG_COLORS.stroke} strokeWidth="2" />
      <line x1={x0 + lineW} y1={y - 15} x2={x0 + lineW} y2={y + 15} stroke={FIG_COLORS.stroke} strokeWidth="2" />
      {/* Rótulo da distância no mapa */}
      <text x={x0 + lineW / 2} y={y - 25} textAnchor="middle" fontSize="16" fontWeight="700" fill={FIG_COLORS.primary} paintOrder="stroke" stroke={FIG_COLORS.surface} strokeWidth="3">
        {mapDist} {unit} (no mapa)
      </text>
      {/* Escala */}
      <text x={x0 + lineW / 2} y={y + 35} textAnchor="middle" fontSize="15" fontWeight="600" fill={FIG_COLORS.label} paintOrder="stroke" stroke={FIG_COLORS.surface} strokeWidth="3">
        Escala 1:{scaleVal}
      </text>
      {/* Ícone de mapa */}
      <rect x={x0 + lineW / 2 - 15} y={y - 8} width={30} height={16} fill="none" stroke={FIG_COLORS.stroke} strokeWidth="1.5" rx="2" />
    </svg>
  );
}

// Figura de diagonal do quadrado
function drawSquareDiagonal(params: Record<string, any>): JSX.Element {
  const side = validateNum(params.side, 7);
  const diagonal = params.diagonal !== null && params.diagonal !== undefined ? params.diagonal : null;
  const unit = params.unit || '';

  const size = Math.min(VB_W - 2 * MARGIN - 80, VB_H - 2 * MARGIN - 60);
  const x0 = (VB_W - size) / 2;
  const y0 = (VB_H - size) / 2 + 10;

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label="Quadrado com diagonal">
      {/* Quadrado */}
      <rect x={x0} y={y0} width={size} height={size} fill="none" stroke={FIG_COLORS.stroke} strokeWidth="2.5" strokeLinejoin="round" />
      {/* Diagonal */}
      <line x1={x0} y1={y0 + size} x2={x0 + size} y2={y0} stroke={FIG_COLORS.primary} strokeWidth="3" strokeDasharray="8 4" />
      {/* Marcador de ângulo reto */}
      <path d={marcadorAnguloReto(x0, y0 + size, x0 + size, y0 + size, x0, y0, 14)} fill="none" stroke={FIG_COLORS.stroke} strokeWidth="1.5" />
      {/* Rótulo lado */}
      <text x={x0 + size / 2} y={y0 + size + 22} textAnchor="middle" dominantBaseline="hanging" fontSize="15" fontWeight="700" fill={FIG_COLORS.label} paintOrder="stroke" stroke={FIG_COLORS.surface} strokeWidth="3">
        l = {side} {unit}
      </text>
      {/* Rótulo diagonal */}
      <text x={x0 + size / 2 + 18} y={y0 + size / 2 - 12} textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="700" fill={FIG_COLORS.primary} paintOrder="stroke" stroke={FIG_COLORS.surface} strokeWidth="3" transform={`rotate(-45, ${x0 + size / 2 + 18}, ${y0 + size / 2 - 12})`}>
        d = {diagonal !== null ? `${diagonal} ${unit}` : '?'}
      </text>
    </svg>
  );
}

// ---- Timer Component ----
function Timer({ timeLeft, totalTime, noTimeLimit, elapsed }: { timeLeft: number; totalTime: number; noTimeLimit: boolean; elapsed: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = noTimeLimit ? 0 : (timeLeft / totalTime) * circumference;
  const isWarning = !noTimeLimit && timeLeft <= 30;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const eMin = Math.floor(elapsed / 60);
  const eSec = elapsed % 60;

  if (noTimeLimit) {
    return (
      <div className="timer-container" role="timer" aria-label={`Tempo decorrido: ${eMin}:${eSec.toString().padStart(2, '0')}`}>
        <div className="timer-text">{eMin}:{eSec.toString().padStart(2, '0')}</div>
      </div>
    );
  }

  return (
    <div className="timer-container" role="timer" aria-label={`Tempo restante: ${minutes}:${seconds.toString().padStart(2, '0')}`}>
      <svg className="timer-ring" viewBox="0 0 120 120">
        <circle className="timer-ring-bg" cx="60" cy="60" r={radius} />
        <circle
          className={`timer-ring-progress ${isWarning ? 'warning' : ''}`}
          cx="60" cy="60" r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
      </svg>
      <span className={`timer-text ${isWarning ? 'warning' : ''}`}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}

// ---- Main App ----
type Screen = 'home' | 'game' | 'explanation' | 'final' | 'analysis' | 'report' | 'gallery';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [lang, setLang] = useState('pt');
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('geoquiz-settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch { return DEFAULT_SETTINGS; }
  });
  const [numPlayers, setNumPlayers] = useState(1);
  const [players, setPlayers] = useState<PlayerConfig[]>([
    { name: 'Jogador 1', colorIndex: 0, shapeIndex: 0, keys: PLAYER_KEYS[0] }
  ]);
  const [gameMode, setGameMode] = useState<'classic' | 'ai'>('classic');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [answers, setAnswers] = useState<(number | null)[][]>([]);
  const [answerTimes, setAnswerTimes] = useState<(number | null)[][]>([]);
  const [lockedPlayers, setLockedPlayers] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState('');
  const [dialogAction, setDialogAction] = useState<(() => void) | null>(null);
  const [snackbar, setSnackbar] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [explanationStep, setExplanationStep] = useState(6);
  const [rulerY, setRulerY] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartRef = useRef<number>(Date.now());

  // Save settings
  useEffect(() => {
    try { localStorage.setItem('geoquiz-settings', JSON.stringify(settings)); } catch {}
  }, [settings]);

  // Theme
  useEffect(() => {
    const root = document.documentElement;
    let theme = settings.theme;
    if (theme === 'auto') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-contrast', settings.contrast);
    root.setAttribute('data-motion', settings.motionScheme);
    root.setAttribute('data-no-motion', (!settings.animationsEnabled).toString());
    if (settings.colorBlindMode !== 'none') {
      root.setAttribute('data-colorblind', settings.colorBlindMode);
    } else {
      root.removeAttribute('data-colorblind');
    }
    document.body.style.setProperty('--font-scale', (settings.fontSize / 100).toString());
    document.body.style.setProperty('--letter-spacing-adj', `${settings.letterSpacing}em`);
    document.body.style.setProperty('--word-spacing-adj', `${settings.wordSpacing}em`);
    document.body.style.setProperty('--line-height-adj', settings.lineHeight.toString());
    if (settings.bgColor !== 'white') {
      document.body.setAttribute('data-bg', settings.bgColor);
    } else {
      document.body.removeAttribute('data-bg');
    }
    if (settings.largeTouchTargets) {
      document.body.classList.add('large-targets');
    } else {
      document.body.classList.remove('large-targets');
    }
    if (settings.focusMode) {
      document.documentElement.setAttribute('data-focus-mode', 'true');
    } else {
      document.documentElement.removeAttribute('data-focus-mode');
    }
    document.documentElement.lang = lang;
  }, [settings, lang]);

  // Welcome dialog on first run
  useEffect(() => {
    try {
      if (!localStorage.getItem('geoquiz-welcomed')) {
        setShowWelcome(true);
        localStorage.setItem('geoquiz-welcomed', 'true');
      }
    } catch {}
  }, []);

  // System preference listener
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (settings.theme === 'auto') {
        document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [settings.theme]);

  // Reading ruler
  useEffect(() => {
    if (!settings.readingRuler) return;
    const handler = (e: MouseEvent) => setRulerY(e.clientY);
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [settings.readingRuler]);

  // Update players
  useEffect(() => {
    const newPlayers: PlayerConfig[] = [];
    for (let i = 0; i < numPlayers; i++) {
      newPlayers.push({
        name: players[i]?.name || `Jogador ${i + 1}`,
        colorIndex: i,
        shapeIndex: i,
        keys: PLAYER_KEYS[i],
      });
    }
    setPlayers(newPlayers);
  }, [numPlayers]);

  // Timer
  useEffect(() => {
    if (screen !== 'game') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    const noTime = settings.timePerQuestion === 0;
    if (noTime) {
      questionStartRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - questionStartRef.current) / 1000));
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }

    setTimeLeft(settings.timePerQuestion);
    questionStartRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          // Time up - transition to explanation
          setTimeout(() => {
            setScreen('explanation');
            setExplanationStep(6);
          }, 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [screen, currentQ, settings.timePerQuestion]);

  // Keyboard handler
  useEffect(() => {
    if (screen !== 'game') return;
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      players.forEach((player, pi) => {
        if (lockedPlayers[pi]) return;
        const keyIndex = player.keys.indexOf(key);
        if (keyIndex !== -1) {
          handleAnswer(pi, keyIndex);
        }
      });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [screen, players, lockedPlayers, questions, currentQ]);

  // Prepare game
  const startGame = useCallback(() => {
    const totalQ = numPlayers * 7;
    const talesCount = Math.ceil(totalQ / 2);
    const metricsCount = totalQ - talesCount;

    // Select questions
    const talesQs = QUESTION_BANK.filter(q => q.topic === 'tales');
    const metricsQs = QUESTION_BANK.filter(q => q.topic === 'metrics');

    const selected: Question[] = [];
    // Easy
    const easyTales = talesQs.filter(q => q.difficulty === 'easy');
    const easyMetrics = metricsQs.filter(q => q.difficulty === 'easy');
    // Medium
    const medTales = talesQs.filter(q => q.difficulty === 'medium');
    const medMetrics = metricsQs.filter(q => q.difficulty === 'medium');
    // Hard
    const hardTales = talesQs.filter(q => q.difficulty === 'hard');
    const hardMetrics = metricsQs.filter(q => q.difficulty === 'hard');

    const perDiff = Math.ceil(totalQ / 3);

    // Add easy
    for (let i = 0; i < Math.min(perDiff, easyTales.length); i++) selected.push(easyTales[i]);
    for (let i = 0; i < Math.min(perDiff, easyMetrics.length); i++) selected.push(easyMetrics[i]);
    // Fill with medium
    while (selected.length < totalQ * 0.66 && medTales.length > 0) {
      const idx = selected.filter(q => q.topic === 'tales').length;
      if (idx < medTales.length) selected.push(medTales[idx]);
      else break;
    }
    while (selected.filter(q => q.topic === 'metrics').length < selected.filter(q => q.topic === 'tales').length + 1 && medMetrics.length > 0) {
      const idx = selected.filter(q => q.topic === 'metrics').length - easyMetrics.length;
      if (idx >= 0 && idx < medMetrics.length) selected.push(medMetrics[idx]);
      else break;
    }
    // Fill with hard
    for (let i = 0; selected.length < totalQ && i < hardTales.length; i++) selected.push(hardTales[i]);
    for (let i = 0; selected.length < totalQ && i < hardMetrics.length; i++) selected.push(hardMetrics[i]);

    // If still not enough, use generators
    while (selected.length < totalQ) {
      const seed = Date.now() + selected.length;
      if (selected.filter(q => q.topic === 'tales').length < talesCount) {
        selected.push(generateTalesQuestion(seed));
      } else {
        selected.push(generateMetricsQuestion(seed));
      }
    }

    // Shuffle options for each question
    const shuffled = selected.slice(0, totalQ).map(q => {
      const indices = q.options.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      return {
        ...q,
        options: indices.map(i => q.options[i]),
        correctIndex: indices.indexOf(q.correctIndex),
      };
    });

    setQuestions(shuffled);
    setScores(new Array(numPlayers).fill(0));
    setAnswers(Array.from({ length: totalQ }, () => new Array(numPlayers).fill(null)));
    setAnswerTimes(Array.from({ length: totalQ }, () => new Array(numPlayers).fill(null)));
    setLockedPlayers(new Array(numPlayers).fill(false));
    setCurrentQ(0);
    setScreen('game');
    questionStartRef.current = Date.now();
    setElapsed(0);
  }, [numPlayers, settings.timePerQuestion]);

  // Sound effects using Web Audio API
  const playSound = useCallback((type: 'correct' | 'wrong' | 'timeup') => {
    if (!settings.soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = settings.soundVolume;

      switch (type) {
        case 'correct':
          osc.frequency.value = 523.25;
          osc.type = 'sine';
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
          break;
        case 'wrong':
          osc.frequency.value = 220;
          osc.type = 'sawtooth';
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
          break;
        case 'timeup':
          osc.frequency.value = 440;
          osc.type = 'square';
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
          break;
      }
    } catch {}
  }, [settings.soundEnabled, settings.soundVolume]);

  const endQuestion = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setScreen('explanation');
    setExplanationStep(6);
  }, []);

  // Handle answer
  const handleAnswer = useCallback((playerIndex: number, optionIndex: number) => {
    if (screen !== 'game') return;
    const q = questions[currentQ];
    if (!q) return;

    const timeTaken = Math.floor((Date.now() - questionStartRef.current) / 1000);

    setAnswers(prev => {
      const next = [...prev];
      next[currentQ] = [...next[currentQ]];
      next[currentQ][playerIndex] = optionIndex;
      return next;
    });
    setAnswerTimes(prev => {
      const next = [...prev];
      next[currentQ] = [...next[currentQ]];
      next[currentQ][playerIndex] = timeTaken;
      return next;
    });

    if (optionIndex === q.correctIndex) {
      playSound('correct');
      setScores(prev => { const n = [...prev]; n[playerIndex]++; return n; });
      setTimeout(() => endQuestion(), 600);
    } else {
      playSound('wrong');
      setLockedPlayers(prev => {
        const next = [...prev];
        next[playerIndex] = true;
        if (next.every(l => l)) {
          setTimeout(() => endQuestion(), 500);
        }
        return next;
      });
    }
  }, [screen, questions, currentQ, numPlayers, playSound, endQuestion]);

  const nextQuestion = useCallback(() => {
    if (currentQ + 1 >= questions.length) {
      setScreen('final');
    } else {
      setCurrentQ(prev => prev + 1);
      setLockedPlayers(new Array(numPlayers).fill(false));
      questionStartRef.current = Date.now();
      setElapsed(0);
      setScreen('game');
    }
  }, [currentQ, questions.length, numPlayers]);

  // Show snackbar
  const showSnackbar = (msg: string) => {
    setSnackbar(msg);
    setTimeout(() => setSnackbar(''), 3000);
  };

  // Translation helper
  const tr = (key: string) => t(key, lang);

  // Total questions
  const totalQuestions = numPlayers * 7;

  // ---- Figure Validation ----
  function validateFigure(svgElement: SVGElement | null, questionId: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!svgElement) {
      errors.push(`${questionId}: SVG element is null`);
      return { valid: false, errors };
    }
    try {
      const svgEl = svgElement as unknown as SVGSVGElement;
      const bbox = svgEl.getBBox();
      if (isNaN(bbox.x) || isNaN(bbox.y) || isNaN(bbox.width) || isNaN(bbox.height)) {
        errors.push(`${questionId}: BBox contains NaN values`);
      }
      // Check viewBox
      const viewBox = svgElement.getAttribute('viewBox');
      if (!viewBox) {
        errors.push(`${questionId}: Missing viewBox`);
      }
      // Check for text elements outside viewBox
      if (viewBox) {
        const [, , vbW, vbH] = viewBox.split(' ').map(Number);
        const texts = svgElement.querySelectorAll('text');
        texts.forEach((text, i) => {
          const x = parseFloat(text.getAttribute('x') || '0');
          const y = parseFloat(text.getAttribute('y') || '0');
          if (isNaN(x) || isNaN(y)) {
            errors.push(`${questionId}: Text[${i}] has NaN coordinates`);
          }
          if (x < -20 || x > vbW + 20 || y < -20 || y > vbH + 20) {
            errors.push(`${questionId}: Text[${i}] at (${x},${y}) is outside viewBox`);
          }
        });
      }
    } catch (e) {
      errors.push(`${questionId}: getBBox() failed - ${e}`);
    }
    return { valid: errors.length === 0, errors };
  }

  // ---- Gallery Screen ----
  const GalleryScreen = () => {
    const galleryRef = useRef<HTMLDivElement>(null);
    const [validationResults, setValidationResults] = useState<Record<string, { valid: boolean; errors: string[] }>>({});

    useEffect(() => {
      // Validate all figures after render
      setTimeout(() => {
        if (!galleryRef.current) return;
        const results: Record<string, { valid: boolean; errors: string[] }> = {};
        const figures = galleryRef.current.querySelectorAll('[data-question-id]');
        figures.forEach(fig => {
          const id = fig.getAttribute('data-question-id') || '';
          const svg = fig.querySelector('svg');
          results[id] = validateFigure(svg, id);
        });
        setValidationResults(results);
      }, 100);
    }, []);

    // Generate 10 variations from each generator
    const generatedTales = Array.from({ length: 10 }, (_, i) => generateTalesQuestion(Date.now() + i));
    const generatedMetrics = Array.from({ length: 10 }, (_, i) => generateMetricsQuestion(Date.now() + 100 + i));
    const allQuestions = [...QUESTION_BANK, ...generatedTales, ...generatedMetrics];

    return (
      <div ref={galleryRef} style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 className="headline-large mb-md">Galeria de Figuras</h1>
        <p className="body-medium mb-lg">
          Todas as figuras do banco de questões e 10 variações de cada gerador paramétrico.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
          {allQuestions.map((q) => {
            const result = validationResults[q.id];
            return (
              <div key={q.id} className="card card-outlined" data-question-id={q.id} style={{ padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="label-medium" style={{ fontFamily: 'monospace' }}>{q.id}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span className="chip chip-tonal" style={{ fontSize: '11px', padding: '2px 8px' }}>
                      {q.topic === 'tales' ? 'Tales' : 'Métricas'}
                    </span>
                    <span className="chip" style={{ fontSize: '11px', padding: '2px 8px' }}>
                      {q.difficulty}
                    </span>
                    {result && (
                      <span className="chip" style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        background: result.valid ? '#C8E6C9' : '#FFCDD2',
                        color: result.valid ? '#1B5E20' : '#B71C1C',
                        border: 'none',
                      }}>
                        {result.valid ? '✓ OK' : '✗ Erro'}
                      </span>
                    )}
                  </div>
                </div>
                <QuestionFigure question={q} />
                {result && !result.valid && (
                  <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--md-sys-color-error, #B3261E)' }}>
                    {result.errors.map((e, i) => <div key={i}>{e}</div>)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-lg">
          <h2 className="title-medium mb-md">Resumo da Validação</h2>
          <p className="body-medium">
            Total: {Object.keys(validationResults).length} figuras validadas.
            Passaram: {Object.values(validationResults).filter(r => r.valid).length}.
            Falharam: {Object.values(validationResults).filter(r => !r.valid).length}.
          </p>
        </div>
      </div>
    );
  };

  // Hash-based routing for gallery
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#figuras' || window.location.hash === '#icones') {
        setScreen('gallery');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // ---- RENDER ----
  return (
    <div className="app-container">
      {/* Skip link */}
      <a href="#main-content" className="skip-link">{tr('skipToContent')}</a>

      {/* Decorative shapes */}
      {settings.decorativeShapes && (
        <div className="decorative-shapes" aria-hidden="true">
          <div className="decorative-shape" />
          <div className="decorative-shape" />
          <div className="decorative-shape" />
        </div>
      )}

      {/* Reading ruler */}
      {settings.readingRuler && screen !== 'home' && (
        <div className="reading-ruler" style={{ top: rulerY - 24 }} aria-hidden="true" />
      )}

      {/* App Bar */}
      <header className="app-bar" role="banner">
        <div className="app-bar-logo">
          <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
            <polygon points="4,32 18,4 32,32" fill="none" stroke="var(--md-sys-color-primary)" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M28 8 A12 12 0 0 1 28 28" fill="none" stroke="var(--md-sys-color-tertiary)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="home-title" style={{ fontSize: '1.5rem' }}>GeoQuiz</span>
        </div>
        <div className="app-bar-actions">
          <button
            className="btn-icon"
            onClick={() => setSettingsOpen(true)}
            aria-label={tr('settings')}
            title={tr('settings')}
          >
            <Icon name="gear" size={24} />
          </button>
          <button
            className="btn-icon"
            onClick={() => setSettingsOpen(true)}
            aria-label={tr('accessibility')}
            title={tr('accessibility')}
          >
            <Icon name="accessibility" size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="main-content" role="main">
        {/* HOME SCREEN */}
        {screen === 'home' && (
          <div className="home-screen">
            <div className="home-logo">
              <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
                <polygon points="10,70 40,10 70,70" fill="var(--md-sys-color-primary-container)" stroke="var(--md-sys-color-primary)" strokeWidth="3" strokeLinejoin="round" />
                <rect x="35" y="55" width="10" height="10" fill="none" stroke="var(--md-sys-color-primary)" strokeWidth="2" />
                <path d="M60 15 A20 20 0 0 1 60 55" fill="none" stroke="var(--md-sys-color-tertiary)" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <h1 className="home-title">GeoQuiz</h1>
              <p className="home-subtitle">{tr('subtitle')}</p>
            </div>

            {/* Players */}
            <div className="player-setup">
              <h2 className="title-large">{tr('players')}</h2>

              {/* Number of players selector */}
              <div className="button-group" role="radiogroup" aria-label={tr('players')}>
                {[1, 2, 3, 4].map(n => (
                  <button
                    key={n}
                    className={`button-group-item ${numPlayers === n ? 'active' : ''}`}
                    onClick={() => setNumPlayers(n)}
                    role="radio"
                    aria-checked={numPlayers === n}
                  >
                    {n}
                  </button>
                ))}
              </div>

              {/* Player cards */}
              {players.map((player, i) => (
                <div key={i} className="player-card" style={{ '--player-color': PLAYER_COLORS[i].light } as React.CSSProperties}>
                  <PlayerShape shape={i} color={PLAYER_COLORS[i].light} size={40} />
                  <input
                    type="text"
                    value={player.name}
                    onChange={e => {
                      const next = [...players];
                      next[i] = { ...next[i], name: e.target.value };
                      setPlayers(next);
                    }}
                    placeholder={`${tr('player')} ${i + 1}`}
                    aria-label={`${tr('name')} - ${tr('player')} ${i + 1}`}
                  />
                  <div className="player-keys" aria-label={`${tr('keys')}: ${PLAYER_KEYS[i].join(', ')}`}>
                    {PLAYER_KEYS[i].map((k, ki) => (
                      <span key={ki} className="key-badge">{k}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Game mode */}
            {settings.aiEnabled && (
              <div className="button-group" role="radiogroup" aria-label="Modo de jogo">
                <button
                  className={`button-group-item ${gameMode === 'classic' ? 'active' : ''}`}
                  onClick={() => setGameMode('classic')}
                  role="radio"
                  aria-checked={gameMode === 'classic'}
                >
                  {tr('classic')}
                </button>
                <button
                  className={`button-group-item ${gameMode === 'ai' ? 'active' : ''}`}
                  onClick={() => setGameMode('ai')}
                  role="radio"
                  aria-checked={gameMode === 'ai'}
                >
                  <Icon name="sparkle" size={16} /> {tr('aiMode')}
                </button>
              </div>
            )}

            {/* Match summary */}
            <div className="match-summary">
              <h3 className="title-medium">{tr('matchSummary')}</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-value">{totalQuestions}</span>
                  <span className="summary-label">{tr('totalQuestions')}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-value">{numPlayers}</span>
                  <span className="summary-label">{tr('players')}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-value">
                    {settings.timePerQuestion === 0 ? tr('noTimeLimit') : `${settings.timePerQuestion}s`}
                  </span>
                  <span className="summary-label">{tr('timePerQuestion')}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-value">{gameMode === 'ai' ? tr('ia') : tr('classic')}</span>
                  <span className="summary-label">{tr('topic')}</span>
                </div>
              </div>
            </div>

            {/* Start button */}
            <button className="fab-extended" onClick={startGame}>
              <Icon name="play" size={24} />
              {tr('start')}
            </button>
          </div>
        )}

        {/* GAME SCREEN */}
        {screen === 'game' && questions[currentQ] && (
          <div className="game-screen">
            {/* Header */}
            <div className="game-header">
              <span className="question-progress">
                {tr('question')} {currentQ + 1} {tr('of')} {totalQuestions}
              </span>
              <div className="question-chips">
                <span className="chip chip-tonal">
                  {questions[currentQ].topic === 'tales' ? tr('tales') : tr('metrics')}
                </span>
                <span className="chip">
                  {tr(questions[currentQ].difficulty)}
                </span>
                {gameMode === 'ai' && (
                  <span className="chip chip-assist">
                    <Icon name="sparkle" size={14} /> {tr('ia')}
                  </span>
                )}
              </div>
              <Timer
                timeLeft={timeLeft}
                totalTime={settings.timePerQuestion}
                noTimeLimit={settings.timePerQuestion === 0}
                elapsed={elapsed}
              />
            </div>

            {/* Scoreboard */}
            <div className="scoreboard" role="status" aria-label={tr('score')}>
              {players.map((player, i) => (
                <div
                  key={i}
                  className={`score-card ${lockedPlayers[i] ? 'locked' : ''}`}
                  style={{ color: PLAYER_COLORS[i].light }}
                >
                  <PlayerShape shape={i} color={PLAYER_COLORS[i].light} size={28} />
                  <span className="score-name">{player.name}</span>
                  <span className="score-value">{scores[i]}</span>
                  {lockedPlayers[i] && (
                    <Icon name="x" size={16} />
                  )}
                </div>
              ))}
            </div>

            {/* Question */}
            <div className="game-layout">
              <div>
                <div className="question-card">
                  <p className="question-statement">{questions[currentQ].statement}</p>
                  <QuestionFigure question={questions[currentQ]} />
                </div>
              </div>
              <div>
                <div className="options-grid" role="radiogroup" aria-label={tr('question')}>
                  {questions[currentQ].options.map((opt, oi) => (
                    <button
                      key={oi}
                      className={`option-button ${answers[currentQ]?.some(a => a === oi) ? (oi === questions[currentQ].correctIndex ? 'correct' : 'wrong') : ''}`}
                      onClick={() => {
                        // For solo or first available player
                        const availablePlayer = lockedPlayers.findIndex(l => !l);
                        if (availablePlayer !== -1) {
                          handleAnswer(availablePlayer, oi);
                        }
                      }}
                      role="radio"
                      aria-checked={false}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + oi)}</span>
                      <span>{opt}</span>
                      {numPlayers > 1 && (
                        <span className="option-key">
                          {players.map((p, pi) => !lockedPlayers[pi] ? p.keys[oi] : '').filter(Boolean).join('/')}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* End question button (no time mode) */}
                {settings.timePerQuestion === 0 && (
                  <button
                    className="btn btn-outlined mt-lg"
                    onClick={() => {
                      setDialogMsg(tr('confirmEnd'));
                      setDialogAction(() => endQuestion);
                      setDialogOpen(true);
                    }}
                  >
                    <Icon name="flag" size={18} />
                    {tr('endQuestion')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* EXPLANATION SCREEN */}
        {screen === 'explanation' && questions[currentQ] && (
          <div className="explanation-screen">
            <div className="question-card">
              <div className="flex items-center gap-md mb-md">
                <span className="question-progress">
                  {tr('question')} {currentQ + 1} {tr('of')} {totalQuestions}
                </span>
                {answers[currentQ]?.map((a, pi) => (
                  <span key={pi} className="chip" style={{
                    background: a === questions[currentQ].correctIndex ? '#C8E6C9' :
                      a !== null ? 'var(--md-sys-color-error-container)' : 'var(--md-sys-color-surface-container)',
                    color: a === questions[currentQ].correctIndex ? '#1B5E20' :
                      a !== null ? 'var(--md-sys-color-on-error-container)' : 'var(--md-sys-color-on-surface-variant)',
                  }}>
                    <PlayerShape shape={pi} color={PLAYER_COLORS[pi].light} size={16} />
                    {players[pi].name}: {a !== null ? (a === questions[currentQ].correctIndex ? tr('correct') : tr('wrong')) : tr('noAnswer')}
                  </span>
                ))}
              </div>
              <p className="question-statement">{questions[currentQ].statement}</p>
              <QuestionFigure question={questions[currentQ]} />
              {/* Show correct answer highlighted */}
              <div className="options-grid mt-md">
                {questions[currentQ].options.map((opt, oi) => (
                  <div
                    key={oi}
                    className={`option-button ${oi === questions[currentQ].correctIndex ? 'correct' : ''}`}
                    style={{ cursor: 'default' }}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + oi)}</span>
                    <span>{opt}</span>
                    {oi === questions[currentQ].correctIndex && <Icon name="check" size={20} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation sections */}
            <div className="explanation-section">
              <h3 className="explanation-title">
                <Icon name="lightbulb" size={20} />
                {tr('mainIdea')}
              </h3>
              <p>{questions[currentQ].explanation.mainIdea}</p>
            </div>

            <div className="explanation-section">
              <h3 className="explanation-title">
                <Icon name="formula" size={20} />
                {tr('formula')}
              </h3>
              <p style={{ fontFamily: 'serif', fontSize: '1.1em', fontStyle: 'italic' }}>
                {questions[currentQ].explanation.formula}
              </p>
            </div>

            {explanationStep >= 3 && (
              <div className="explanation-section">
                <h3 className="explanation-title">
                  <Icon name="ruler" size={20} />
                  {tr('steps')}
                </h3>
                <ol className="explanation-steps">
                  {questions[currentQ].explanation.steps.map((step, si) => (
                    <li key={si}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {explanationStep >= 4 && (
              <div className="explanation-section">
                <h3 className="explanation-title">
                  <Icon name="check" size={20} />
                  {tr('verification')}
                </h3>
                <p>{questions[currentQ].explanation.verification}</p>
              </div>
            )}

            {explanationStep >= 5 && (
              <div className="explanation-section">
                <h3 className="explanation-title">
                  <Icon name="x" size={20} />
                  {tr('whyWrong')}
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {questions[currentQ].explanation.whyWrong.map((reason, ri) => (
                    <li key={ri} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span className="option-letter" style={{ width: 24, height: 24, fontSize: '0.75rem', flexShrink: 0 }}>
                        {String.fromCharCode(65 + ri)}
                      </span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {explanationStep >= 6 && (
              <div className="explanation-section">
                <h3 className="explanation-title">
                  <Icon name="lightbulb" size={20} />
                  {tr('tip')}
                </h3>
                <p>{questions[currentQ].explanation.tip}</p>
              </div>
            )}

            {/* Show next step button */}
            {explanationStep < 6 && (
              <button className="btn btn-tonal" onClick={() => setExplanationStep(prev => prev + 1)}>
                {tr('showNextStep')}
                <Icon name="chevronDown" size={18} />
              </button>
            )}

            {/* Next question button */}
            <button className="fab-extended" onClick={nextQuestion}>
              {currentQ + 1 >= totalQuestions ? tr('finalScore') : tr('next')}
              <Icon name="arrowRight" size={20} />
            </button>
          </div>
        )}

        {/* FINAL SCREEN */}
        {screen === 'final' && (
          <div className="final-screen">
            <div className="winner-card">
              <div className="winner-trophy">
                <Icon name="trophy" size={64} filled />
              </div>
              <h2 className="headline-large">
                {numPlayers === 1
                  ? `${tr('yourScore')}: ${scores[0]} ${tr('of')} 7`
                  : (() => {
                      const maxScore = Math.max(...scores);
                      const winners = scores.map((s, i) => s === maxScore ? i : -1).filter(i => i >= 0);
                      if (winners.length > 1) return tr('tie');
                      return `${tr('winner')}: ${players[winners[0]].name}`;
                    })()
                }
              </h2>
            </div>

            {/* Results table */}
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table className="results-table" role="table">
                <thead>
                  <tr>
                    <th scope="col">{tr('player')}</th>
                    <th scope="col">{tr('score')}</th>
                    <th scope="col">{tr('correct')}</th>
                    <th scope="col">{tr('wrong')}</th>
                    <th scope="col">{tr('accuracy')}</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, pi) => {
                    const correct = scores[pi];
                    const total = 7;
                    const wrong = answers.filter((a, qi) => a[pi] !== null && a[pi] !== questions[qi]?.correctIndex).length;
                    const noAns = answers.filter((a, qi) => a[pi] === null).length;
                    return (
                      <tr key={pi}>
                        <td>
                          <div className="flex items-center gap-sm">
                            <PlayerShape shape={pi} color={PLAYER_COLORS[pi].light} size={24} />
                            {player.name}
                          </div>
                        </td>
                        <td><strong>{correct}</strong></td>
                        <td>{correct}</td>
                        <td>{wrong + noAns}</td>
                        <td>{Math.round((correct / total) * 100)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Performance chart */}
            <div className="chart-container">
              <h3 className="title-medium mb-md">{tr('performance')}</h3>
              <div className="bar-chart" style={{ height: '150px', alignItems: 'flex-end' }}>
                {players.map((player, pi) => (
                  <div key={pi} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <span className="label-medium">{scores[pi]}/7</span>
                    <div
                      className="bar"
                      style={{
                        height: `${(scores[pi] / 7) * 100}%`,
                        background: PLAYER_COLORS[pi].light,
                        minHeight: '8px',
                        width: '100%',
                        maxWidth: '60px',
                      }}
                    />
                    <span className="label-small">{player.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="final-actions">
              <button className="btn btn-filled" onClick={() => { setScreen('home'); }}>
                <Icon name="restart" size={20} />
                {tr('playAgain')}
              </button>
              <button className="btn btn-tonal" onClick={() => setScreen('analysis')}>
                <Icon name="chart" size={20} />
                {tr('analyzeErrors')}
              </button>
              <button className="btn btn-outlined" onClick={() => {
                generateTxtReport();
                showSnackbar(tr('saved'));
              }}>
                <Icon name="download" size={20} />
                {tr('saveReport')}
              </button>
            </div>
          </div>
        )}

        {/* ANALYSIS SCREEN */}
        {screen === 'analysis' && (
          <div className="explanation-screen">
            <h2 className="headline-medium">{tr('analysisTitle')}</h2>
            {players.map((player, pi) => {
              const errors = answers.map((a, qi) => ({
                qi,
                answer: a[pi],
                correct: questions[qi]?.correctIndex,
                time: answerTimes[qi]?.[pi],
              })).filter(e => e.answer !== e.correct);

              if (errors.length === 0) {
                return (
                  <div key={pi} className="card" style={{ borderLeft: `4px solid #2E7D32` }}>
                    <p className="title-medium">{player.name}: {tr('noErrors')}</p>
                  </div>
                );
              }

              return (
                <div key={pi}>
                  <h3 className="title-large mt-lg">{player.name}</h3>
                  {errors.map((err, ei) => (
                    <div key={ei} className="analysis-card">
                      <p className="body-medium"><strong>{tr('question')} {err.qi + 1}:</strong> {questions[err.qi]?.statement}</p>
                      <p className="body-small mt-md">
                        {tr('correct')}: {questions[err.qi]?.options[err.correct]} |
                        {tr('wrong')}: {err.answer !== null ? questions[err.qi]?.options[err.answer!] : tr('noAnswer')}
                      </p>
                      <p className="body-small">{tr('tip')}: {questions[err.qi]?.explanation.tip}</p>
                    </div>
                  ))}
                </div>
              );
            })}
            <button className="fab-extended" onClick={() => setScreen('final')}>
              <Icon name="arrowLeft" size={20} />
              {tr('finalScore')}
            </button>
          </div>
        )}

        {/* GALLERY SCREEN */}
        {screen === 'gallery' && <GalleryScreen />}
      </main>

      {/* SETTINGS SHEET */}
      <div className={`sheet-overlay ${settingsOpen ? 'open' : ''}`} onClick={() => setSettingsOpen(false)} />
      <div className={`sheet sheet-side ${settingsOpen ? 'open' : ''}`} role="dialog" aria-label={tr('settings')}>
        <div className="sheet-header">
          <h2 className="headline-small">{tr('settings')}</h2>
          <button className="btn-icon" onClick={() => setSettingsOpen(false)} aria-label={tr('close')}>
            <Icon name="close" size={24} />
          </button>
        </div>

        {/* Language */}
        <div className="settings-section">
          <h3 className="settings-section-title">{tr('language')}</h3>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
            {[
              { code: 'pt', label: 'Português' },
              { code: 'en', label: 'English' },
              { code: 'es', label: 'Español' },
            ].map(l => (
              <button
                key={l.code}
                className={`chip ${lang === l.code ? 'selected' : ''}`}
                onClick={() => setLang(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Game */}
        <div className="settings-section">
          <h3 className="settings-section-title">{tr('timePerQuestion')}</h3>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
            {[
              { value: 30, label: '30s' },
              { value: 60, label: '1 min' },
              { value: 120, label: '2 min' },
              { value: 180, label: '3 min' },
              { value: 300, label: '5 min' },
              { value: 600, label: '10 min' },
              { value: 0, label: tr('noTimeLimit') },
            ].map(opt => (
              <button
                key={opt.value}
                className={`chip ${settings.timePerQuestion === opt.value ? 'selected' : ''}`}
                onClick={() => setSettings(prev => ({ ...prev, timePerQuestion: opt.value }))}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {settings.timePerQuestion === 0 && (
            <div className="settings-item mt-md">
              <span className="settings-item-label">{tr('showElapsedTime')}</span>
              <div
                className={`switch ${settings.showElapsedTime ? 'on' : ''}`}
                onClick={() => setSettings(prev => ({ ...prev, showElapsedTime: !prev.showElapsedTime }))}
                role="switch"
                aria-checked={settings.showElapsedTime}
                tabIndex={0}
              >
                <div className="switch-thumb" />
              </div>
            </div>
          )}
        </div>

        {/* Appearance */}
        <div className="settings-section">
          <h3 className="settings-section-title">{tr('theme')}</h3>
          <div className="flex gap-sm">
            {[
              { value: 'auto', label: tr('auto'), icon: 'globe' },
              { value: 'light', label: tr('light'), icon: 'sun' },
              { value: 'dark', label: tr('dark'), icon: 'moon' },
            ].map(th => (
              <button
                key={th.value}
                className={`chip ${settings.theme === th.value ? 'selected' : ''}`}
                onClick={() => setSettings(prev => ({ ...prev, theme: th.value as any }))}
              >
                <Icon name={th.icon} size={16} />
                {th.label}
              </button>
            ))}
          </div>

          {/* Seed color palettes */}
          <h4 className="label-large mt-md mb-md">{tr('palette')}</h4>
          <div className="color-picker-grid">
            {Object.entries(SEED_PALETTES).map(([name, color]) => (
              <button
                key={name}
                className={`color-swatch ${settings.seedColor === color ? 'selected' : ''}`}
                style={{ background: color }}
                onClick={() => setSettings(prev => ({ ...prev, seedColor: color }))}
                aria-label={tr(name)}
                title={tr(name)}
              />
            ))}
          </div>

          {/* Contrast */}
          <h4 className="label-large mt-md mb-md">{tr('contrast')}</h4>
          <div className="flex gap-sm">
            {(['default', 'medium', 'high'] as const).map(c => (
              <button
                key={c}
                className={`chip ${settings.contrast === c ? 'selected' : ''}`}
                onClick={() => setSettings(prev => ({ ...prev, contrast: c }))}
              >
                {tr(c === 'default' ? 'defaultC' : c === 'medium' ? 'mediumC' : 'highC')}
              </button>
            ))}
          </div>

          {/* Decorative shapes */}
          <div className="settings-item">
            <span className="settings-item-label">{tr('decorativeShapes')}</span>
            <div
              className={`switch ${settings.decorativeShapes ? 'on' : ''}`}
              onClick={() => setSettings(prev => ({ ...prev, decorativeShapes: !prev.decorativeShapes }))}
              role="switch"
              aria-checked={settings.decorativeShapes}
              tabIndex={0}
            >
              <div className="switch-thumb" />
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <div className="settings-section">
          <h3 className="settings-section-title">{tr('accessibility')}</h3>

          {/* Font size */}
          <div className="settings-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <span className="settings-item-label">{tr('fontSize')}: {settings.fontSize}%</span>
            <div className="slider-container">
              <input
                type="range"
                className="slider"
                min={80}
                max={200}
                step={10}
                value={settings.fontSize}
                onChange={e => setSettings(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                aria-label={tr('fontSize')}
              />
            </div>
          </div>

          {/* Animations */}
          <div className="settings-item">
            <span className="settings-item-label">{tr('animations')}</span>
            <div
              className={`switch ${settings.animationsEnabled ? 'on' : ''}`}
              onClick={() => setSettings(prev => ({ ...prev, animationsEnabled: !prev.animationsEnabled }))}
              role="switch"
              aria-checked={settings.animationsEnabled}
              tabIndex={0}
            >
              <div className="switch-thumb" />
            </div>
          </div>

          {/* Sound */}
          <div className="settings-item">
            <span className="settings-item-label">{tr('sound')}</span>
            <div
              className={`switch ${settings.soundEnabled ? 'on' : ''}`}
              onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
              role="switch"
              aria-checked={settings.soundEnabled}
              tabIndex={0}
            >
              <div className="switch-thumb" />
            </div>
          </div>

          {/* Large touch targets */}
          <div className="settings-item">
            <span className="settings-item-label">{tr('largeTargets')}</span>
            <div
              className={`switch ${settings.largeTouchTargets ? 'on' : ''}`}
              onClick={() => setSettings(prev => ({ ...prev, largeTouchTargets: !prev.largeTouchTargets }))}
              role="switch"
              aria-checked={settings.largeTouchTargets}
              tabIndex={0}
            >
              <div className="switch-thumb" />
            </div>
          </div>

          {/* Color blind mode */}
          <div className="settings-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <span className="settings-item-label">{tr('colorblind')}</span>
            <div className="flex gap-sm mt-md" style={{ flexWrap: 'wrap' }}>
              {[
                { value: 'none', label: tr('off') },
                { value: 'protanopia', label: 'Protanopia' },
                { value: 'deuteranopia', label: 'Deuteranopia' },
                { value: 'tritanopia', label: 'Tritanopia' },
              ].map(cb => (
                <button
                  key={cb.value}
                  className={`chip ${settings.colorBlindMode === cb.value ? 'selected' : ''}`}
                  onClick={() => setSettings(prev => ({ ...prev, colorBlindMode: cb.value as any }))}
                >
                  {cb.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reading ruler */}
          <div className="settings-item">
            <span className="settings-item-label">{tr('readingRuler')}</span>
            <div
              className={`switch ${settings.readingRuler ? 'on' : ''}`}
              onClick={() => setSettings(prev => ({ ...prev, readingRuler: !prev.readingRuler }))}
              role="switch"
              aria-checked={settings.readingRuler}
              tabIndex={0}
            >
              <div className="switch-thumb" />
            </div>
          </div>

          {/* Focus mode */}
          <div className="settings-item">
            <span className="settings-item-label">{tr('focusMode')}</span>
            <div
              className={`switch ${settings.focusMode ? 'on' : ''}`}
              onClick={() => setSettings(prev => ({ ...prev, focusMode: !prev.focusMode }))}
              role="switch"
              aria-checked={settings.focusMode}
              tabIndex={0}
            >
              <div className="switch-thumb" />
            </div>
          </div>

          {/* Reading background */}
          <div className="settings-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <span className="settings-item-label">{tr('readingBg')}</span>
            <div className="flex gap-sm mt-md" style={{ flexWrap: 'wrap' }}>
              {[
                { value: 'white', label: tr('white'), color: '#FFFFFF' },
                { value: 'cream', label: tr('cream'), color: '#FFF8E7' },
                { value: 'softYellow', label: tr('softYellow'), color: '#FFFDE7' },
                { value: 'blueGray', label: tr('blueGray'), color: '#ECEFF1' },
                { value: 'softGreen', label: tr('softGreen'), color: '#E8F5E9' },
              ].map(bg => (
                <button
                  key={bg.value}
                  className={`color-swatch ${settings.bgColor === bg.value ? 'selected' : ''}`}
                  style={{ background: bg.color, border: '2px solid var(--md-sys-color-outline-variant)' }}
                  onClick={() => setSettings(prev => ({ ...prev, bgColor: bg.value }))}
                  aria-label={bg.label}
                />
              ))}
            </div>
          </div>

          {/* Accessibility profiles */}
          <h4 className="label-large mt-md mb-md">{tr('profile')}</h4>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
            {[
              { value: 'dyslexia', label: tr('dyslexia') },
              { value: 'lowVision', label: tr('lowVision') },
              { value: 'colorblind', label: tr('colorblind') },
              { value: 'adhd', label: tr('adhd') },
              { value: 'motor', label: tr('motor') },
            ].map(p => (
              <button
                key={p.value}
                className={`chip ${settings.accessibilityProfile === p.value ? 'selected' : ''}`}
                onClick={() => applyProfile(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Mode */}
        <div className="settings-section">
          <h3 className="settings-section-title">{tr('aiMode')}</h3>
          <div className="settings-item">
            <span className="settings-item-label">{tr('aiMode')}</span>
            <div
              className={`switch ${settings.aiEnabled ? 'on' : ''}`}
              onClick={() => setSettings(prev => ({ ...prev, aiEnabled: !prev.aiEnabled }))}
              role="switch"
              aria-checked={settings.aiEnabled}
              tabIndex={0}
            >
              <div className="switch-thumb" />
            </div>
          </div>
          {settings.aiEnabled && (
            <>
              <div className="settings-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <label className="settings-item-label" htmlFor="api-key">{tr('apiKey')}</label>
                <input
                  id="api-key"
                  type="password"
                  value={settings.aiApiKey}
                  onChange={e => setSettings(prev => ({ ...prev, aiApiKey: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid var(--md-sys-color-outline)',
                    borderRadius: 'var(--md-sys-shape-corner-small)',
                    background: 'var(--md-sys-color-surface)',
                    color: 'var(--md-sys-color-on-surface)',
                    fontFamily: 'inherit',
                    marginTop: '8px',
                  }}
                  placeholder="AIza..."
                />
                <p className="settings-item-desc mt-md">
                  Gere uma chave gratuita em aistudio.google.com/apikey
                </p>
              </div>
            </>
          )}
        </div>

        {/* Restore defaults */}
        <button
          className="btn btn-text w-full"
          onClick={() => {
            setSettings(DEFAULT_SETTINGS);
            showSnackbar(tr('restore'));
          }}
        >
          <Icon name="restart" size={18} />
          {tr('restore')}
        </button>
      </div>

      {/* Dialog */}
      <div className={`dialog-overlay ${dialogOpen ? 'open' : ''}`} onClick={() => setDialogOpen(false)}>
        <div className="dialog" onClick={e => e.stopPropagation()} role="alertdialog" aria-modal="true">
          <h3 className="dialog-title">{tr('confirm')}</h3>
          <p className="dialog-content">{dialogMsg}</p>
          <div className="dialog-actions">
            <button className="btn btn-text" onClick={() => setDialogOpen(false)}>{tr('no')}</button>
            <button className="btn btn-filled" onClick={() => {
              dialogAction?.();
              setDialogOpen(false);
            }}>{tr('yes')}</button>
          </div>
        </div>
      </div>

      {/* Snackbar */}
      <div className={`snackbar ${snackbar ? 'show' : ''}`} role="status" aria-live="polite">
        {snackbar}
      </div>

      {/* Welcome dialog */}
      {showWelcome && (
        <div className="dialog-overlay open" onClick={() => setShowWelcome(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <h3 className="dialog-title">{tr('welcome')}</h3>
            <p className="dialog-content">{tr('welcomeMsg')}</p>
            <div className="flex gap-sm" style={{ flexWrap: 'wrap', marginBottom: '16px' }}>
              {[
                { value: 'dyslexia', label: tr('dyslexia') },
                { value: 'lowVision', label: tr('lowVision') },
                { value: 'default', label: tr('defaultC') },
              ].map(p => (
                <button
                  key={p.value}
                  className="chip"
                  onClick={() => {
                    if (p.value !== 'default') applyProfile(p.value);
                    setShowWelcome(false);
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="dialog-actions">
              <button className="btn btn-filled" onClick={() => setShowWelcome(false)}>{tr('skip')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ---- Helper functions ----
  function applyProfile(profile: string) {
    const base = { ...DEFAULT_SETTINGS };
    switch (profile) {
      case 'dyslexia':
        setSettings({
          ...base,
          fontSize: 120,
          lineHeight: 1.8,
          letterSpacing: 0.05,
          wordSpacing: 0.1,
          textAlign: 'left',
          bgColor: 'cream',
          fontFamily: 'system',
          accessibilityProfile: 'dyslexia',
        });
        break;
      case 'lowVision':
        setSettings({
          ...base,
          fontSize: 150,
          contrast: 'high',
          largeTouchTargets: true,
          accessibilityProfile: 'lowVision',
        });
        break;
      case 'colorblind':
        setSettings({
          ...base,
          colorBlindMode: 'deuteranopia',
          accessibilityProfile: 'colorblind',
        });
        break;
      case 'adhd':
        setSettings({
          ...base,
          decorativeShapes: false,
          animationsEnabled: false,
          focusMode: true,
          accessibilityProfile: 'adhd',
        });
        break;
      case 'motor':
        setSettings({
          ...base,
          largeTouchTargets: true,
          confirmBeforeSubmit: true,
          accessibilityProfile: 'motor',
        });
        break;
      default:
        setSettings({ ...base, accessibilityProfile: 'custom' });
    }
  }

  function generateTxtReport() {
    const date = new Date().toISOString().split('T')[0];
    let txt = `GeoQuiz - ${tr('report')}\n`;
    txt += `${tr('summary')}: ${date}\n`;
    txt += `${tr('players')}: ${players.map(p => p.name).join(', ')}\n`;
    txt += `${tr('totalQuestions')}: ${totalQuestions}\n`;
    txt += `${tr('timePerQuestion')}: ${settings.timePerQuestion === 0 ? tr('noTimeLimit') : settings.timePerQuestion + 's'}\n\n`;
    txt += `--- ${tr('finalScore')} ---\n`;
    players.forEach((p, i) => {
      txt += `${p.name}: ${scores[i]}/7 (${Math.round((scores[i] / 7) * 100)}%)\n`;
    });
    txt += `\n--- ${tr('performance')} ---\n`;
    const talesCorrect = questions.filter((q, i) => q.topic === 'tales' && answers[i]?.some(a => a === q.correctIndex)).length;
    const metricsCorrect = questions.filter((q, i) => q.topic === 'metrics' && answers[i]?.some(a => a === q.correctIndex)).length;
    txt += `${tr('tales')}: ${talesCorrect}\n`;
    txt += `${tr('metrics')}: ${metricsCorrect}\n`;
    txt += `\n--- ${tr('review')} ---\n`;
    questions.forEach((q, i) => {
      const anyWrong = answers[i]?.some((a, pi) => a !== q.correctIndex);
      if (anyWrong) {
        txt += `Q${i + 1}: ${q.statement}\n`;
        txt += `  ${tr('correct')}: ${q.options[q.correctIndex]}\n`;
        txt += `  ${tr('tip')}: ${q.explanation.tip}\n\n`;
      }
    });

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geoquiz-resumo-${date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
