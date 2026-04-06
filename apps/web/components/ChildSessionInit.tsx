'use client';

import { useEffect } from 'react';

export function ChildSessionInit({ childId }: { childId: string }) {
  useEffect(() => {
    if (childId) sessionStorage.setItem('childId', childId);
  }, [childId]);

  return null;
}
