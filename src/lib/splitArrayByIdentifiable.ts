import { Id, Identifiable } from "@/store";

export function splitArrayByIdentifiable<AnIdentifiableObject extends Identifiable>(
	array: AnIdentifiableObject[],
	idToSplitBy: Id,
): [AnIdentifiableObject[], AnIdentifiableObject, AnIdentifiableObject[]] {
	const itemIndex = array.findIndex(({ id }) => id === idToSplitBy);

	if (itemIndex === -1) throw new Error("Item you are looking for does not exist in the archives!");

	const startOfList = array.slice(0, itemIndex);
	const foundItem = array[itemIndex];
	const endOfList = array.slice(itemIndex + 1);

	return [startOfList, foundItem, endOfList];
}
