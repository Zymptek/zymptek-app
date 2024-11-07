import { createAvatar } from '@dicebear/core';
import { identicon } from '@dicebear/collection';

export const generateAvatar = (seed: string): string => {
  const avatar = createAvatar(identicon, {
    seed,
    backgroundColor: ['#0EA5E9', '#6366F1', '#8B5CF6', '#EC4899', '#F97316'], // Updated brand colors
    backgroundType: ['solid'],
    size: 128,
  });

  return avatar.toDataUri();
}; 