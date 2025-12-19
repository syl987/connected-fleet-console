import { HttpParams } from '@angular/common/http';

export function toHttpParams(obj: Record<string, any>): HttpParams {
  let p = new HttpParams();
  Object.entries(obj).forEach(([key, val]) => {
    if (val == null) return; // skip null/undefined
    if (Array.isArray(val)) {
      val.forEach(v => {
        p = p.append(key, String(v));
      }); // repeated params: ?tag=a&tag=b
    } else if (typeof val === 'object') {
      // choose a strategy: flatten or stringify
      p = p.set(key, JSON.stringify(val)); // or flatten with dot notation
    } else {
      p = p.set(key, String(val));
    }
  });
  return p;
}
