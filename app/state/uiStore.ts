import { create } from "zustand";

type UIState = {
	loading: boolean;
	error: string | null;
	modalVisible: boolean;
	modalType: string | null;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	showModal: (type: string) => void;
	hideModal: () => void;
};

export const useUIStore = create<UIState>((set) => ({
	loading: false,
	error: null,
	modalVisible: false,
	modalType: null,
	setLoading: (loading) => set({ loading }),
	setError: (error) => set({ error }),
	showModal: (type) => set({ modalVisible: true, modalType: type }),
	hideModal: () => set({ modalVisible: false, modalType: null }),
}));

