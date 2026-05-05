/**
 * useSound — Sound Hook Stub
 *
 * Provides a stable interface for triggering Mario-themed sound effects.
 * All methods are no-ops in this stub implementation. Replace the bodies
 * with real Web Audio API calls when sound support is added.
 */

/** Shape returned by the useSound hook. */
export interface UseSoundReturn {
  /** Play the bounce sound effect (e.g. block hit, jump). */
  playBounce: () => void;
  /** Play the coin-collect sound effect. */
  playCoin: () => void;
  /** Play the pipe-warp sound effect. */
  playPipe: () => void;
}

/**
 * useSound
 *
 * Returns no-op sound-effect callbacks. This is a stub — wire up real
 * audio playback here when the sound system is implemented.
 *
 * @returns {UseSoundReturn} Object containing playBounce, playCoin, and playPipe methods.
 */
export function useSound(): UseSoundReturn {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noop = (): void => {};

  return {
    playBounce: noop,
    playCoin: noop,
    playPipe: noop,
  };
}
