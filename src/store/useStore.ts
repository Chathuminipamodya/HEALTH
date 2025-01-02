import { create } from 'zustand';

interface StoreState {
  clickCount: number;
  activeUserIndexes: Set<number>;
  incrementCount: () => void;
  toggleActiveUser: (index: number) => void;
  resetActiveUsers: () => void; // Reset active users when logging out
  resetClickCount: () => void;  // Reset click count when logging out
}

const useStore = create<StoreState>((set) => ({
  clickCount: 0,
  activeUserIndexes: new Set<number>(),
  incrementCount: () => set((state) => ({ clickCount: state.clickCount + 1 })),
  toggleActiveUser: (index) => set((state) => {
    const newActiveUserIndexes = new Set(state.activeUserIndexes);
    if (!newActiveUserIndexes.has(index)) {
      newActiveUserIndexes.add(index); // Mark the user as active
      return { activeUserIndexes: newActiveUserIndexes };
    }
    return {}; // Do nothing if the user is already active
  }),
  resetActiveUsers: () => set({ activeUserIndexes: new Set() }), // Reset active users
  resetClickCount: () => set({ clickCount: 0 }), // Reset click count
}));

export default useStore;
