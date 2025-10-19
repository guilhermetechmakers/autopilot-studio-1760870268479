/**
 * Password Service
 * Handles password validation, strength checking, and hashing utilities
 * Note: Actual hashing should be done on the server side
 */

export interface PasswordStrength {
  score: number; // 0-4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  feedback: string[];
  color: string;
}

export class PasswordService {
  /**
   * Password requirements
   */
  static readonly MIN_LENGTH = 8;
  static readonly MAX_LENGTH = 128;
  static readonly REQUIRE_UPPERCASE = true;
  static readonly REQUIRE_LOWERCASE = true;
  static readonly REQUIRE_NUMBER = true;
  static readonly REQUIRE_SPECIAL = true;

  /**
   * Special characters allowed in passwords
   */
  static readonly SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  /**
   * Common weak passwords (subset - full list should be on server)
   */
  private static readonly COMMON_PASSWORDS = new Set([
    'password',
    'password123',
    '12345678',
    'qwerty',
    'abc123',
    'letmein',
    'welcome',
    'monkey',
    '1234567890',
    'admin',
  ]);

  /**
   * Validate password against requirements
   */
  static validate(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }

    if (password.length < this.MIN_LENGTH) {
      errors.push(`Password must be at least ${this.MIN_LENGTH} characters`);
    }

    if (password.length > this.MAX_LENGTH) {
      errors.push(`Password must be less than ${this.MAX_LENGTH} characters`);
    }

    if (this.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (this.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (this.REQUIRE_NUMBER && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (this.REQUIRE_SPECIAL && !new RegExp(`[${this.SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password)) {
      errors.push('Password must contain at least one special character');
    }

    if (this.COMMON_PASSWORDS.has(password.toLowerCase())) {
      errors.push('This password is too common. Please choose a stronger password');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate password strength
   */
  static calculateStrength(password: string): PasswordStrength {
    if (!password) {
      return {
        score: 0,
        label: 'Very Weak',
        feedback: ['Password is required'],
        color: 'rgb(244, 122, 122)', // accent-red
      };
    }

    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (password.length < 8) {
      feedback.push('Use at least 8 characters');
    }

    // Character variety
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      score++;
    } else {
      feedback.push('Mix uppercase and lowercase letters');
    }

    if (/\d/.test(password)) {
      score++;
    } else {
      feedback.push('Add numbers');
    }

    if (new RegExp(`[${this.SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password)) {
      score++;
    } else {
      feedback.push('Add special characters (!@#$%^&*)');
    }

    // Penalize common patterns
    if (/(.)\1{2,}/.test(password)) {
      score = Math.max(0, score - 1);
      feedback.push('Avoid repeated characters');
    }

    if (/^[0-9]+$/.test(password)) {
      score = Math.max(0, score - 2);
      feedback.push('Avoid using only numbers');
    }

    if (this.COMMON_PASSWORDS.has(password.toLowerCase())) {
      score = 0;
      feedback.push('This password is too common');
    }

    // Sequential characters
    if (this.hasSequentialChars(password)) {
      score = Math.max(0, score - 1);
      feedback.push('Avoid sequential characters (abc, 123)');
    }

    // Normalize score to 0-4
    const normalizedScore = Math.min(4, Math.max(0, Math.floor(score / 1.5)));

    const labels: Array<'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong'> = [
      'Very Weak',
      'Weak',
      'Fair',
      'Strong',
      'Very Strong',
    ];

    const colors = [
      'rgb(244, 122, 122)', // Very Weak - red
      'rgb(255, 223, 110)', // Weak - yellow
      'rgb(96, 180, 247)',  // Fair - blue
      'rgb(114, 212, 122)', // Strong - green
      'rgb(114, 212, 122)', // Very Strong - green
    ];

    if (feedback.length === 0) {
      feedback.push('Great password!');
    }

    return {
      score: normalizedScore,
      label: labels[normalizedScore],
      feedback,
      color: colors[normalizedScore],
    };
  }

  /**
   * Check for sequential characters
   */
  private static hasSequentialChars(password: string): boolean {
    const sequences = [
      'abcdefghijklmnopqrstuvwxyz',
      '0123456789',
      'qwertyuiop',
      'asdfghjkl',
      'zxcvbnm',
    ];

    const lowerPassword = password.toLowerCase();

    for (const seq of sequences) {
      for (let i = 0; i < seq.length - 2; i++) {
        const substring = seq.substring(i, i + 3);
        if (lowerPassword.includes(substring) || lowerPassword.includes(substring.split('').reverse().join(''))) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Generate a random strong password
   */
  static generatePassword(length: number = 16): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = this.SPECIAL_CHARS;

    const allChars = uppercase + lowercase + numbers + special;

    // Ensure at least one of each required type
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  /**
   * Hash password (client-side - for demonstration only)
   * In production, ALWAYS hash on the server
   */
  static async hashPassword(password: string): Promise<string> {
    // This is a simple client-side hash for demonstration
    // NEVER use this for actual password storage
    // Real hashing should be done server-side with bcrypt/Argon2

    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  /**
   * Compare password with hash (server-side only)
   * This is a placeholder - actual comparison must be done on server
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    // This should NEVER be done client-side in production
    // This is just a placeholder for the service structure
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }

  /**
   * Check if password has been compromised (requires API)
   * Uses Have I Been Pwned API with k-anonymity
   */
  static async checkCompromised(password: string): Promise<boolean> {
    try {
      // Hash the password
      const hash = await this.hashPassword(password);
      const prefix = hash.substring(0, 5).toUpperCase();
      const suffix = hash.substring(5).toUpperCase();

      // Query HIBP API with k-anonymity
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const text = await response.text();

      // Check if our suffix appears in the results
      const hashes = text.split('\n');
      for (const line of hashes) {
        const [hashSuffix] = line.split(':');
        if (hashSuffix === suffix) {
          return true; // Password has been compromised
        }
      }

      return false; // Password is safe
    } catch (error) {
      console.error('Failed to check password compromise:', error);
      // Fail open - don't block user if API is down
      return false;
    }
  }
}
