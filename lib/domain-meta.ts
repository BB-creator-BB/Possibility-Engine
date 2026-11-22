import type { SystemicDomain } from '@/types/scenario';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DomainStyleMeta {
  label: string;
  shortCode: string;
  badgeClass: string;
  dotClass: string;
  borderAccentClass: string;
}

export const DOMAIN_META: Record<SystemicDomain, DomainStyleMeta> = {
  economy: {
    label: 'Economy',
    shortCode: 'ECON',
    badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
    dotClass: 'bg-emerald-400',
    borderAccentClass: 'border-l-emerald-400/70',
  },
  society: {
    label: 'Society',
    shortCode: 'SOC',
    badgeClass: 'bg-sky-500/10 text-sky-300 border-sky-500/25',
    dotClass: 'bg-sky-400',
    borderAccentClass: 'border-l-sky-400/70',
  },
  governance: {
    label: 'Governance',
    shortCode: 'GOV',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
    dotClass: 'bg-amber-400',
    borderAccentClass: 'border-l-amber-400/70',
  },
  identity: {
    label: 'Identity',
    shortCode: 'ID',
    badgeClass: 'bg-violet-500/10 text-violet-300 border-violet-500/25',
    dotClass: 'bg-violet-400',
    borderAccentClass: 'border-l-violet-400/70',
  },
  culture: {
    label: 'Culture',
    shortCode: 'CULT',
    badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
    dotClass: 'bg-rose-400',
    borderAccentClass: 'border-l-rose-400/70',
  },
  technology: {
    label: 'Technology',
    shortCode: 'TECH',
    badgeClass: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
    dotClass: 'bg-cyan-400',
    borderAccentClass: 'border-l-cyan-400/70',
  },
};
