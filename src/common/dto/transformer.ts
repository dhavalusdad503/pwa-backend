import { Transform } from 'class-transformer';

// transformers.ts
export const ToBoolean = () =>
  Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') {
      const v = value.toLowerCase().trim();
      if (['true', '1', 'yes', 'on'].includes(v)) return true;
      if (['false', '0', 'no', 'off'].includes(v)) return false;
    }
    return false;
  });

export const ToNumber = () =>
  Transform(({ value }) => {
    const n = Number(value);
    return isNaN(n) ? undefined : n;
  });

export const ToString = () =>
  Transform(({ value }) => {
    if (value === null || value === undefined) return undefined;
    return String(value);
  });

export const ToDateString = () =>
  Transform(({ value }) => {
    console.log({ value });
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date.toISOString();
  });
