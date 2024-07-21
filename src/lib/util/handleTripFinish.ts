import { Stopwatch, channelIsSendable } from '@oldschoolgg/toolkit';
import { activity_type_enum } from '@prisma/client';
import type {
	AttachmentBuilder,
	ButtonBuilder,
	MessageCollector,
	MessageCreateOptions
} from 'discord.js';
import { Time, randInt, roll } from 'e';
import { Bank } from 'oldschooljs';
import { alching } from '../../mahoji/commands/laps';
import { calculateBirdhouseDetails } from '../../mahoji/lib/abstracted_commands/birdhousesCommand';
import { canRunAutoContract } from '../../mahoji/lib/abstracted_commands/farmingContractCommand';
import { handleTriggerShootingStar } from '../../mahoji/lib/abstracted_commands/shootingStarsCommand';
import { userStatsBankUpdate, userStatsUpdate } from '../../mahoji/mahojiSettings';
import { PortentID, chargePortentIfHasCharges, getAllPortentCharges } from '../bso/divination';
import { gods } from '../bso/divineDominion';
import { MysteryBoxes } from '../bsoOpenables';
import { ClueTiers } from '../clues/clueTiers';
import { buildClueButtons } from '../clues/clueUtils';
import { combatAchievementTripEffect } from '../combat_achievements/combatAchievements';
import { BitField, Emoji, PerkTier } from '../constants';
import { handleGrowablePetGrowth } from '../growablePets';
import { handlePassiveImplings } from '../implings';
import { InventionID, inventionBoosts, inventionItemBoost } from '../invention/inventions';
import { triggerRandomEvent } from '../randomEvents';
import { RuneTable, WilvusTable, WoodTable } from '../simulation/seedTable';
import { DougTable, PekyTable } from '../simulation/sharedTables';
import { calculateZygomiteLoot } from '../skilling/skills/farming/zygomites';
import { SkillsEnum } from '../skilling/types';
import { getUsersCurrentSlayerInfo } from '../slayer/slayerUtil';
import type { ActivityTaskData } from '../types/minions';
import { makeComponents } from '../util';
import {
	makeAutoContractButton,
	makeAutoSlayButton,
	makeBirdHouseTripButton,
	makeNewSlayerTaskButton,
	makeOpenCasketButton,
	makeOpenSeedPackButton,
	makeRepeatTripButton
} from './globalInteractions';
import { handleCrateSpawns } from './handleCrateSpawns';
import itemID from './itemID';
import { perHourChance } from './smallUtils';
import { sendToChannelID } from './webhook';

const collectors = new Map<string, MessageCollector>();

interface TripFinishEffectOptions {
	data: ActivityTaskData;
	user: MUser;
	loot: Bank | null;
	messages: string[];
	portents?: Awaited<ReturnType<typeof getAllPortentCharges>>;
}

type TripEffectReturn = {
	itemsToAddWithCL?: Bank;
	itemsToRemove?: Bank;
};

export interface TripFinishEffect {
	name: string;
	// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
	fn: (options: TripFinishEffectOptions) => Promise<TripEffectReturn | undefined | void>;
}

const tripFinishEffects: TripFinishEffect[] = [
	{
		name: 'Implings',
		fn: async ({ data, messages, user }) => {
			const imp = await handlePassiveImplings(user, data, messages);
			if (imp && imp.bank.length > 0) {
				await userStatsBankUpdate(user, 'passive_implings_bank', imp.bank);
				return {
					itemsToAddWithCL: imp.bank
				};
			}
			return {};
		}
	},
	{
		name: 'Growable Pets',
		fn: async ({ data, messages, user }) => {
			await handleGrowablePetGrowth(user, data, messages);
		}
	},
	{
		name: 'Random Events',
		fn: async ({ data, messages, user }) => {
			return triggerRandomEvent(user, data.type, data.duration, messages);
		}
	},
	{
		name: 'Loot Doubling',
		fn: async ({ data, user, loot }) => {
			const cantBeDoubled = ['GroupMonsterKilling', 'KingGoldemar', 'Ignecarus', 'Inferno', 'Alching', 'Agility'];
			if (
				loot &&
				!data.cantBeDoubled &&
				!cantBeDoubled.includes(data.type) &&
				data.duration > Time.Minute * 20 &&
				roll(user.usingPet('Mr. E') ? 12 : 15)
			) {
				const otherLoot = new Bank().add(MysteryBoxes.roll());
				const bonusLoot = new Bank().add(loot).add(otherLoot);

				await Promise.all([userStatsBankUpdate(user.id, 'doubled_loot_bank', bonusLoot)]);
				return {
					itemsToAddWithCL: bonusLoot
				};
			}
		}
	},
	{
		name: 'Custom Pet Perk',
		fn: async ({ data, messages, user }) => {
			const pet = user.user.minion_equippedPet;
			const minutes = Math.floor(data.duration / Time.Minute);
			if (minutes < 5) return;
			const bonusLoot = new Bank();
			switch (pet) {
				case itemID('Peky'): {
					for (let i = 0; i < minutes; i++) {
						if (roll(10)) {
							bonusLoot.add(PekyTable.roll());
						}
					}
					userStatsBankUpdate(user.id, 'peky_loot_bank', bonusLoot);
					messages.push(
						`<:peky:787028037031559168> Peky flew off and got you some seeds during this trip: ${bonusLoot}.`
					);
					break;
				}
				case itemID('Obis'): {
					const rolls = minutes / 3;
					for (let i = 0; i < rolls; i++) {
						bonusLoot.add(RuneTable.roll());
					}
					userStatsBankUpdate(user.id, 'obis_loot_bank', bonusLoot);
					messages.push(
						`<:obis:787028036792614974> Obis did some runecrafting during this trip and got you: ${bonusLoot}.`
					);
					break;
				}
				case itemID('Brock'): {
					const rolls = minutes / 3;
					for (let i = 0; i < rolls; i++) {
						bonusLoot.add(WoodTable.roll());
					}
					userStatsBankUpdate(user.id, 'brock_loot_bank', bonusLoot);
					messages.push(
						`<:brock:787310793183854594> Brock did some woodcutting during this trip and got you: ${bonusLoot}.`
					);
					break;
				}
				case itemID('Wilvus'): {
					const rolls = minutes / 6;
					for (let i = 0; i < rolls; i++) {
						bonusLoot.add(WilvusTable.roll());
					}
					userStatsBankUpdate(user.id, 'wilvus_loot_bank', bonusLoot);
					messages.push(
						`<:wilvus:787320791011164201> Wilvus did some pickpocketing during this trip and got you: ${bonusLoot}.`
					);
					break;
				}
				case itemID('Smokey'): {
					for (let i = 0; i < minutes; i++) {
						if (roll(450)) {
							bonusLoot.add(MysteryBoxes.roll());
						}
					}
					userStatsBankUpdate(user.id, 'smokey_loot_bank', bonusLoot);
					if (bonusLoot.length > 0) {
						messages.push(
							`<:smokey:787333617037869139> Smokey did some walking around while you were on your trip and found you ${bonusLoot}.`
						);
					}
					break;
				}
				case itemID('Doug'): {
					for (let i = 0; i < minutes / 2; i++) {
						bonusLoot.add(DougTable.roll());
					}
					userStatsBankUpdate(user.id, 'doug_loot_bank', bonusLoot);
					messages.push(`Doug did some mining while you were on your trip and got you: ${bonusLoot}.`);
					break;
				}
				case itemID('Harry'): {
					for (let i = 0; i < minutes; i++) {
						bonusLoot.add('Banana', randInt(1, 3));
					}
					userStatsBankUpdate(user.id, 'harry_loot_bank', bonusLoot);
					messages.push(`<:harry:749945071104819292>: ${bonusLoot}.`);
					break;
				}
				default: {
				}
			}

			return {
				itemsToAddWithCL: bonusLoot
			};
		}
	},
	{
		name: 'Voidling',
		fn: async ({ data, messages, user }) => {
			if (!user.allItemsOwned.has('Voidling')) return;
			const voidlingEquipped = user.usingPet('Voidling');
			const alchResult = alching({
				user,
				tripLength: voidlingEquipped
					? data.duration * (user.hasEquipped('Magic master cape') ? 3 : 1)
					: data.duration / (user.hasEquipped('Magic master cape') ? 1 : randInt(6, 7)),
				isUsingVoidling: true
			});
			if (alchResult !== null) {
				if (!user.owns(alchResult.bankToRemove)) {
					messages.push(
						`Your Voidling couldn't do any alching because you don't own ${alchResult.bankToRemove}.`
					);
				}

				messages.push(
					`<:Voidling:886284972380545034> $alchResult.maxCastsx $
						alchResult.itemToAlch.name<:alch:739456571347566623> $toKMB(alchResult.bankToAdd.amount('Coins'))GP $
						!voidlingEquipped && !user.hasEquipped('Magic master cape')
							? '<:bank:739459924693614653>⏬'
							: ''$user.hasEquipped('Magic master cape') ? '<:Magicmastercape:1115026341314703492>⏫' : ''`
				);
				return {
					itemsToAddWithCL: alchResult.bankToAdd,
					itemsToRemove: alchResult.bankToRemove
				};
			} else if (user.favAlchs(Time.Minute * 30).length !== 0) {
				messages.push(
					"Your Voidling didn't alch anything because you either don't have any nature runes or fire runes."
				);
			}
		}
	},
	{
		name: 'Invention Effects',
		fn: async ({ data, messages, user }) => {
			if (user.hasEquippedOrInBank('Silverhawk boots') && data.duration >= Time.Minute * 5) {
				const costRes = await inventionItemBoost({
					user,
					inventionID: InventionID.SilverHawkBoots,
					duration: data.duration
				});
				if (costRes.success) {
					const xpToReceive = inventionBoosts.silverHawks.passiveXPCalc(
						data.duration,
						user.skillLevel(SkillsEnum.Agility)
					);
					await userStatsUpdate(user.id, {
						silverhawk_boots_passive_xp: {
							increment: xpToReceive
						}
					});
					await user.addXP({
						skillName: SkillsEnum.Agility,
						amount: xpToReceive,
						multiplier: false,
						duration: data.duration
					});
					messages.push(`+$toKMB(xpToReceive)Agility XP from Silverhawk boots (${costRes.messages})`);
				}
			}
		}
	},
	{
		name: 'Message in a Bottle',
		fn: async ({ data, messages }) => {
			const underwaterTrips: activity_type_enum[] = [
				activity_type_enum.UnderwaterAgilityThieving,
				activity_type_enum.DepthsOfAtlantis
			];
			if (!underwaterTrips.includes(data.type)) return;
			if (!roll(500)) return;
			messages.push('You found a message in a bottle!');
			const bottleLoot = new Bank().add('Message in a bottle');
			return {
				itemsToAddWithCL: bottleLoot
			};
		}
	},
	{
		name: 'Crate Spawns',
		fn: async ({ data }) => {
			const crateRes = handleCrateSpawns(data.duration);
			if (crateRes && crateRes.length > 0) {
				return {
					itemsToAddWithCL: crateRes
				};
			}
		}
	},
	{
		name: 'God Favour',
		fn: async ({ data, user }) => {
			if (!('mid' in data)) return;
			if (data.type !== 'MonsterKilling') return;
			const favourableGod = gods.find(g => g.friendlyMonsters.includes(data.mi as number));
			if (!favourableGod) return;
			const unfavorableGods = gods.filter(g => g.name !== favourableGod.name);
			await user.addToGodFavour(
				unfavorableGods.map(g => g.name).filter(g => g !== 'Guthix'),
				data.duration
			);
		}
	},
	{
		name: 'Combat Achievements',
		fn: combatAchievementTripEffect
	},
	{
		name: 'Divine eggs',
		fn: async ({ data, user, portents, messages }) => {
			const skillingTypes: activity_type_enum[] = [
				activity_type_enum.Fishing,
				activity_type_enum.Mining,
				activity_type_enum.Woodcutting,
				activity_type_enum.MemoryHarvest,
				activity_type_enum.Farming,
				activity_type_enum.Hunter
			];
			if (!skillingTypes.includes(data.type)) return;
			const fiveMinuteSegments = Math.floor(data.duration / (Time.Minute * 5));
			if (fiveMinuteSegments < 1) return;
			if (!portents) return;
			const charges = portents[PortentID.RebirthPortent];
			if (!charges) return;
			let eggsReceived = 0;
			for (let i = 0; i < fiveMinuteSegments; i++) {
				perHourChance(Time.Minute * 5, 2, () => {
					eggsReceived += 1;
				});
			}
			eggsReceived = Math.min(eggsReceived, charges);
			if (eggsReceived === 0) return;
			const loot = new Bank().add('Divine egg', eggsReceived);
			const chargeResult = await chargePortentIfHasCharges({
				user,
				portentID: PortentID.RebirthPortent,
				charges: eggsReceived
			});
			if (chargeResult.didCharge) {
				messages.push(
					'You received $loot, your Rebirth portent has $chargeResult.portent.charges_remainingx charges remaining.'
				);
				return {
					itemsToAddWithCL: loot
				};
			}
		}
	},
	{
		name: 'Moonlight mutator',
		fn: async ({ data, user, messages }) => {
			if (!user.bank.has('Moonlight mutator')) return;
			if (user.user.disabled_inventions.includes(InventionID.MoonlightMutator)) return;

			const minutes = Math.floor(data.duration / Time.Minute);
			if (minutes < 1) return;
			const { loot, cost } = calculateZygomiteLoot(minutes, user.bank);

			if (cost.length > 0 || loot.length > 0) {
				if (cost.length > 0 && !user.bank.has(cost)) {
					console.error(`User $user.iddoesn't ML ${cost.toString()}`);
					return;
				}

				if (cost.length > 0 && loot.length === 0) {
					messages.push(`<:moonlightMutator:1220590471613513780> Mutated ${cost}, but all died`);
				} else if (loot.length > 0) {
					messages.push(`<:moonlightMutator:1220590471613513780> Mutated ${cost}; ${loot} survived`);
				}

				return {
					itemsToAddWithCL: loot,
					itemsToRemove: cost
				};
			}
		}
	}
];

export async function handleTripFinish(
	user: MUser,
	channelID: string,
	_message: string | ({ content: string } & MessageCreateOptions),
	attachment: AttachmentBuilder | Buffer | undefined,
	data: ActivityTaskData,
	loot: Bank | null,
	_messages?: string[],
	_components?: ButtonBuilder[]
) {
	const message = typeof _message === 'string' ? { content: _message } : _message;
	if (attachment) {
		if (!message.files) {
			message.files = [attachment];
		} else if (Array.isArray(message.files)) {
			message.files.push(attachment);
		} else {
			console.warn(`Unexpected attachment type in handleTripFinish: ${typeof attachment}`);
		}
	}
	const perkTier = user.perkTier();
	const messages: string[] = [];

	const portents = await getAllPortentCharges(user);
	const itemsToAddWithCL = new Bank();
	const itemsToRemove = new Bank();
	for (const effect of tripFinishEffects) {
		const stopwatch = new Stopwatch().start();
		const res = await effect.fn({ data, user, loot, messages, portents });
		if (res?.itemsToAddWithCL) itemsToAddWithCL.add(res.itemsToAddWithCL);
		if (res?.itemsToRemove) itemsToRemove.add(res.itemsToRemove);
		stopwatch.stop();
		if (stopwatch.duration > 500) {
			debugLog(`Finished ${effect.name} trip effect for ${user.id} in ${stopwatch}`);
		}
	}
	if (itemsToAddWithCL.length > 0 || itemsToRemove.length > 0) {
		await user.transactItems({ itemsToAdd: itemsToAddWithCL, collectionLog: true, itemsToRemove });
		if (itemsToAddWithCL.length > 0) {
		messages.push(`You received: ${itemsToAddWithCL}`);
		}
	}

	const clueReceived = loot ? ClueTiers.filter(tier => loot.amount(tier.scrollID) > 0) : [];

	if (_messages) messages.push(..._messages);
	if (messages.length > 0) {
		message.content += `\n**Messages:** ${messages.join(', ')}`;
	}

	if (clueReceived.length > 0 && perkTier < PerkTier.Two) {
		clueReceived.map(
			clue => (message.content += `\n${Emoji.Casket} **You got a ${clue.name} clue scroll** in your loot.`)
		);
	}

	const existingCollector = collectors.get(user.id);

	if (existingCollector) {
		existingCollector.stop();
		collectors.delete(user.id);
	}

	const channel = globalClient.channels.cache.get(channelID);
	if (!channelIsSendable(channel)) return;

	const components: ButtonBuilder[] = [];
	components.push(makeRepeatTripButton());
	const casketReceived = loot ? ClueTiers.find(i => loot?.has(i.id)) : undefined;
	if (casketReceived) components.push(makeOpenCasketButton(casketReceived));
	if (perkTier > PerkTier.One) {
		components.push(...buildClueButtons(loot, perkTier, user));
		const birdHousedetails = await calculateBirdhouseDetails(user);
		if (birdHousedetails.isReady && !user.bitfield.includes(BitField.DisableBirdhouseRunButton))
			components.push(makeBirdHouseTripButton());

		if ((await canRunAutoContract(user)) && !user.bitfield.includes(BitField.DisableAutoFarmContractButton))
			components.push(makeAutoContractButton());

		const { currentTask } = await getUsersCurrentSlayerInfo(user.id);
		if ((currentTask === null || currentTask.quantity_remaining <= 0) && data.type === 'MonsterKilling') {
			components.push(makeNewSlayerTaskButton());
		} else if (!user.bitfield.includes(BitField.DisableAutoSlayButton)) {
			components.push(makeAutoSlayButton());
		}
		if (loot?.has('Seed pack')) {
			components.push(makeOpenSeedPackButton());
		}
	}

	if (_components) {
		components.push(..._components);
	}

	handleTriggerShootingStar(user, data, components);

	if (components.length > 0) {
		message.components = makeComponents(components);
	}

	handleTriggerShootingStar(user, data, components);

	sendToChannelID(channelID, message);
}
