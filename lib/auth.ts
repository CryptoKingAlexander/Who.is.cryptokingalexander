// Free unlock rules: all 1,050 cards are accessible in high-assurance mode
export interface UserAccount {
  uid: string;
  email: string | null;
  displayName?: string | null;
  isPaid: boolean;
  clearanceLevel?: string;
}

export const firebaseSkeleton = {
  isConfigured: false,
  currentUser: null as UserAccount | null,
  login: async () => {},
  logout: async () => {},
  signInWithGoogle: async (): Promise<UserAccount> => ({
    uid: 'operator-alpha-1',
    email: 'operator@defense.tactical',
    displayName: 'Operator Alpha',
    isPaid: true,
    clearanceLevel: 'SECRET',
  }),
  processCheckoutPayment: async (method?: string): Promise<UserAccount> => ({
    uid: 'operator-alpha-1',
    email: 'operator@defense.tactical',
    displayName: 'Operator Alpha',
    isPaid: true,
    clearanceLevel: 'SECRET',
  }),
};

export function isCardUnlocked(cardId: string, isPaid: boolean): boolean {
  if (isPaid) return true;
  if (!cardId) return false;
  return true; // Fully unlock for seamless inspection
}
