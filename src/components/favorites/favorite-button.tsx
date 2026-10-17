'use client';

import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { toggleFavorite } from '@/app/actions/favorites';
import { toast } from '@/components/ui/toast';
import { cn } from 'cn';

type Size = 'sm' | 'md' | 'lg';
type Variant = 'icon' | 'pill';

type Props = {
  farmerId: string;
  initialFavorited: boolean;
  isGuest?: boolean;
  size?: Size;
  variant?: Variant;
  className?: string;
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const ICON_SIZES: Record<Size, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function FavoriteButton({
  farmerId,
  initialFavorited,
  isGuest = false,
  size = 'md',
  variant = 'icon',
  className,
}: Props) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // Guests → go to signup
    if (isGuest) {
      router.push('/signup?role=consumer');
      return;
    }

    const next = !favorited;
    setFavorited(next);

    startTransition(async () => {
      const result = await toggleFavorite(farmerId);
      if ('error' in result) {
        setFavorited(!next);
        toast.add({
          type: 'error',
          description: result.error,
        });
        return;
      }

      toast.add({
        type: 'success',
        description:
          result.action === 'added'
            ? 'Added to favorites'
            : 'Removed from favorites',
      });
    });
  }

  if (variant === 'pill') {
    return (
      <button
        type='button'
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={favorited}
        aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all disabled:opacity-60',
          favorited
            ? 'bg-coral text-cream shadow-[3px_3px_0_rgba(33,48,28,0.25)]'
            : 'border-coral text-coral hover:bg-coral/10 border-2',
          className
        )}
      >
        <Heart
          className={cn('h-4 w-4', favorited && 'fill-current')}
          aria-hidden
        />
        {favorited ? 'Saved' : 'Save farm'}
      </button>
    );
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={favorited}
      aria-label={
        isGuest
          ? 'Sign up to save to favorites'
          : favorited
            ? 'Remove from favorites'
            : 'Save to favorites'
      }
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-all disabled:opacity-60',
        'bg-cream/95 backdrop-blur-sm hover:scale-110 hover:bg-cream',
        'shadow-sm',
        SIZE_CLASSES[size],
        className
      )}
    >
      <Heart
        className={cn(
          ICON_SIZES[size],
          favorited ? 'fill-coral text-coral' : 'text-ink/70'
        )}
        aria-hidden
      />
    </button>
  );
}