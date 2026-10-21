import prisma from "./prisma";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

interface MemoryRecord {
  attempts: number;
  lockedUntil?: number;
}

const memoryStore = new Map<string, MemoryRecord>();

/**
 * Checks if the IP is allowed to attempt login.
 */
export async function checkRateLimit(ip: string): Promise<{
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
}> {
  const now = Date.now();

  // 1. Fast in-memory check
  const mem = memoryStore.get(ip);
  if (mem && mem.lockedUntil && mem.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((mem.lockedUntil - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds,
    };
  }

  // 2. Database check for distributed/persistent setups
  try {
    const record = await prisma.loginAttempt.findUnique({
      where: { ip },
    });

    if (record && record.lockedUntil && record.lockedUntil.getTime() > now) {
      const retryAfterSeconds = Math.ceil(
        (record.lockedUntil.getTime() - now) / 1000
      );
      return {
        allowed: false,
        remainingAttempts: 0,
        retryAfterSeconds,
      };
    }

    const currentAttempts = record ? record.attempts : (mem?.attempts || 0);
    const remaining = Math.max(0, MAX_ATTEMPTS - currentAttempts);

    return {
      allowed: currentAttempts < MAX_ATTEMPTS,
      remainingAttempts: remaining,
    };
  } catch {
    // If DB is temporarily unreachable during rate check, fall back to memory store
    const current = mem?.attempts || 0;
    return {
      allowed: current < MAX_ATTEMPTS,
      remainingAttempts: Math.max(0, MAX_ATTEMPTS - current),
    };
  }
}

/**
 * Records a failed login attempt for an IP.
 */
export async function recordFailedAttempt(ip: string): Promise<void> {
  const now = Date.now();
  const lockoutTime = new Date(now + LOCKOUT_MINUTES * 60 * 1000);

  // Update memory store
  const currentMem = memoryStore.get(ip) || { attempts: 0 };
  const newAttempts = currentMem.attempts + 1;
  const lockedUntil = newAttempts >= MAX_ATTEMPTS ? lockoutTime.getTime() : undefined;
  memoryStore.set(ip, {
    attempts: newAttempts,
    lockedUntil,
  });

  // Update database record
  try {
    await prisma.loginAttempt.upsert({
      where: { ip },
      create: {
        ip,
        attempts: 1,
        lockedUntil: undefined,
      },
      update: {
        attempts: { increment: 1 },
        lockedUntil: newAttempts >= MAX_ATTEMPTS ? lockoutTime : undefined,
      },
    });
  } catch {
    // Silent fallback to memory store
  }
}

/**
 * Resets the rate limit counter upon successful login.
 */
export async function resetRateLimit(ip: string): Promise<void> {
  memoryStore.delete(ip);
  try {
    await prisma.loginAttempt.deleteMany({
      where: { ip },
    });
  } catch {
    // Ignore
  }
}
