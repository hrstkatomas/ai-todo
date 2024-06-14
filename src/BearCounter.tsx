import { create } from "zustand";

type State = {
	bears: number;
};

type Action = {
	increasePopulation: () => void;
	removeAllBears: () => void;
};

const useStore = create<State & Action>((set) => ({
	bears: 0,
	increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
	removeAllBears: () => set({ bears: 0 }),
}));

function Counter() {
	const bears = useStore((state) => state.bears);
	return <h1>{bears} around here...</h1>;
}

function Controls() {
	const increasePopulation = useStore((state) => state.increasePopulation);
	const removeAllBears = useStore((state) => state.removeAllBears);
	return (
		<>
			<button onClick={increasePopulation}>one up</button>
			<button onClick={removeAllBears}>remove them all</button>
		</>
	);
}

export function BearCounter() {
	return (
		<div>
			<Counter />
			<Controls />
		</div>
	);
}
