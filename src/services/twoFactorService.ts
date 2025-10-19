/**
 * Two-Factor Authentication Service
 * Handles TOTP generation, validation, and backup codes
 */

export interface TOTPSecret {
  secret: string;
  qrCode: string;
  backupCodes?: string[];
}

export interface TOTPValidation {
  isValid: boolean;
  message: string;
}

export class TwoFactorService {
  /**
   * TOTP Configuration
   */
  private static readonly TOTP_WINDOW = 30; // 30 seconds
  private static readonly TOTP_DIGITS = 6;
  private static readonly TOTP_ALGORITHM = 'SHA1';

  /**
   * Generate a random secret for TOTP
   * Note: In production, this should be done server-side
   */
  static generateSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; // Base32 characters
    let secret = '';
    const length = 32;

    for (let i = 0; i < length; i++) {
      secret += chars[Math.floor(Math.random() * chars.length)];
    }

    return secret;
  }

  /**
   * Generate QR code data URL for TOTP setup
   * Format: otpauth://totp/{issuer}:{account}?secret={secret}&issuer={issuer}
   */
  static generateQRCodeURL(
    secret: string,
    accountName: string,
    issuer: string = 'Autopilot Studio'
  ): string {
    const encodedIssuer = encodeURIComponent(issuer);
    const encodedAccount = encodeURIComponent(accountName);
    const otpauthURL = `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secret}&issuer=${encodedIssuer}&algorithm=${this.TOTP_ALGORITHM}&digits=${this.TOTP_DIGITS}&period=${this.TOTP_WINDOW}`;
    
    return otpauthURL;
  }

  /**
   * Validate TOTP token format
   */
  static validateTokenFormat(token: string): boolean {
    // Must be exactly 6 digits
    return /^\d{6}$/.test(token);
  }

  /**
   * Generate backup codes
   */
  static generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric code
      const code = this.generateRandomCode(8);
      // Format as XXXX-XXXX for readability
      const formatted = `${code.substring(0, 4)}-${code.substring(4, 8)}`;
      codes.push(formatted);
    }

    return codes;
  }

  /**
   * Generate a random alphanumeric code
   */
  private static generateRandomCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    return code;
  }

  /**
   * Validate backup code format
   */
  static validateBackupCodeFormat(code: string): boolean {
    // Must be in format XXXX-XXXX
    return /^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code.toUpperCase());
  }

  /**
   * Format backup code (add dash if missing)
   */
  static formatBackupCode(code: string): string {
    const cleaned = code.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    
    if (cleaned.length === 8) {
      return `${cleaned.substring(0, 4)}-${cleaned.substring(4, 8)}`;
    }

    return code.toUpperCase();
  }

  /**
   * Calculate TOTP counter based on current time
   * Reserved for future server-side TOTP generation
   */
  // private static getTOTPCounter(time?: number): number {
  //   const currentTime = time || Math.floor(Date.now() / 1000);
  //   return Math.floor(currentTime / this.TOTP_WINDOW);
  // }

  /**
   * Get remaining time in current TOTP window (in seconds)
   */
  static getRemainingTime(): number {
    const currentTime = Math.floor(Date.now() / 1000);
    return this.TOTP_WINDOW - (currentTime % this.TOTP_WINDOW);
  }

  /**
   * Get progress percentage for current TOTP window
   */
  static getWindowProgress(): number {
    const remaining = this.getRemainingTime();
    return ((this.TOTP_WINDOW - remaining) / this.TOTP_WINDOW) * 100;
  }

  /**
   * Estimate when a token will expire
   */
  static getTokenExpiration(): Date {
    const remaining = this.getRemainingTime();
    return new Date(Date.now() + remaining * 1000);
  }

  /**
   * Check if it's a good time to enter TOTP (not about to expire)
   */
  static isGoodTimeToEnterToken(): boolean {
    const remaining = this.getRemainingTime();
    // Good if more than 10 seconds remaining
    return remaining > 10;
  }

  /**
   * Sanitize TOTP input (remove spaces, dashes, etc.)
   */
  static sanitizeToken(token: string): string {
    return token.replace(/\s|-/g, '');
  }

  /**
   * Format TOTP token for display (XXX XXX)
   */
  static formatTokenForDisplay(token: string): string {
    const sanitized = this.sanitizeToken(token);
    if (sanitized.length === 6) {
      return `${sanitized.substring(0, 3)} ${sanitized.substring(3, 6)}`;
    }
    return token;
  }

  /**
   * Verify TOTP token (client-side validation only)
   * Real verification must be done server-side
   */
  static validateToken(token: string): TOTPValidation {
    // Sanitize input
    const sanitizedToken = this.sanitizeToken(token);

    // Check format
    if (!this.validateTokenFormat(sanitizedToken)) {
      return {
        isValid: false,
        message: 'Token must be 6 digits',
      };
    }

    // In production, verification happens server-side
    // This is just format validation
    return {
      isValid: true,
      message: 'Token format is valid',
    };
  }

  /**
   * Generate recovery information for 2FA setup
   */
  static generateRecoveryInfo(): {
    backupCodes: string[];
    printableBackupCodes: string;
    downloadableBackupCodes: Blob;
  } {
    const backupCodes = this.generateBackupCodes();
    
    // Create printable version
    const printableBackupCodes = `
AUTOPILOT STUDIO - BACKUP CODES
Generated: ${new Date().toLocaleString()}

Keep these codes in a safe place. Each code can only be used once.

${backupCodes.map((code, i) => `${(i + 1).toString().padStart(2, '0')}. ${code}`).join('\n')}

IMPORTANT:
- Store these codes securely
- Each code can only be used once
- Generate new codes if you lose these
- Do not share these codes with anyone
    `.trim();

    // Create downloadable file
    const downloadableBackupCodes = new Blob([printableBackupCodes], {
      type: 'text/plain',
    });

    return {
      backupCodes,
      printableBackupCodes,
      downloadableBackupCodes,
    };
  }

  /**
   * Download backup codes as text file
   */
  static downloadBackupCodes(filename: string = 'autopilot-studio-backup-codes.txt'): void {
    const info = this.generateRecoveryInfo();
    const url = URL.createObjectURL(info.downloadableBackupCodes);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Check if user should be warned about 2FA setup
   */
  static shouldWarnAbout2FA(userCreatedAt: Date, has2FA: boolean): boolean {
    if (has2FA) return false;

    const daysSinceCreation = (Date.now() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24);
    
    // Warn after 7 days without 2FA
    return daysSinceCreation > 7;
  }

  /**
   * Get 2FA setup instructions
   */
  static getSetupInstructions(): string[] {
    return [
      'Install an authenticator app on your phone (Google Authenticator, Authy, 1Password, etc.)',
      'Scan the QR code with your authenticator app',
      'Enter the 6-digit code from your app to verify',
      'Save your backup codes in a secure location',
      'You\'ll need to enter a code from your app each time you sign in',
    ];
  }

  /**
   * Get supported authenticator apps
   */
  static getSupportedApps(): Array<{
    name: string;
    platforms: string[];
    url: string;
  }> {
    return [
      {
        name: 'Google Authenticator',
        platforms: ['iOS', 'Android'],
        url: 'https://support.google.com/accounts/answer/1066447',
      },
      {
        name: 'Authy',
        platforms: ['iOS', 'Android', 'Desktop'],
        url: 'https://authy.com/download/',
      },
      {
        name: '1Password',
        platforms: ['iOS', 'Android', 'Desktop'],
        url: 'https://1password.com/',
      },
      {
        name: 'Microsoft Authenticator',
        platforms: ['iOS', 'Android'],
        url: 'https://www.microsoft.com/en-us/security/mobile-authenticator-app',
      },
    ];
  }
}
