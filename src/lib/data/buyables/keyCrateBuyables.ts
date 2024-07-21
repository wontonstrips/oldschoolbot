import { keyCrates } from '../../keyCrates';
import type { Buyable } from './buyables';

export const keyCrateBuyables: Buyable[] = [];

for (const crate of keyCrates) {
	keyCrateBuyables.push({
		name: crate.key.name,
		gpCost: crate.keyCostGP
	});
}
