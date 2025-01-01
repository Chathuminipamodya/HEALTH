import {create} from 'zustand';

interface StoreState {
  clickCount: number;
  incrementCount: () => void;
}

const useStore = create<StoreState>((set) => ({
  clickCount: 0,
  incrementCount: () => set((state) => ({ clickCount: state.clickCount + 1 })),
}));

export default useStore;