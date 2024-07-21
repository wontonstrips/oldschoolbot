import { formatOrdinal } from '@oldschoolgg/toolkit';
import type { CommandRunOptions } from '@oldschoolgg/toolkit';
import { bold } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord.js';
import { notEmpty, randArrItem } from 'e';

import { BLACKLISTED_USERS } from '../../lib/blacklists';
import {
	type BitField,
	BitFieldData,
	FormattedCustomEmoji,
	MAX_LEVEL,
	PerkTier,
	badges,
	minionActivityCache
} from '../../lib/constants';
import { degradeableItems } from '../../lib/degradeableItems';
import { diaries } from '../../lib/diaries';
import { calculateMastery } from '../../lib/mastery';
import { effectiveMonsters } from '../../lib/minions/data/killableMonsters';
import type { AttackStyles } from '../../lib/minions/functions';
import { blowpipeCommand, blowpipeDarts } from '../../lib/minions/functions/blowpipeCommand';
import { degradeableItemsCommand } from '../../lib/minions/functions/degradeableItemsCommand';
import { allPossibleStyles, trainCommand } from '../../lib/minions/functions/trainCommand';
import { Minigames } from '../../lib/settings/minigames';
import Skills from '../../lib/skilling/skills';
import creatures from '../../lib/skilling/skills/hunter/creatures';
import { MUserStats } from '../../lib/structures/MUserStats';
import { convertLVLtoXP, isValidNickname } from '../../lib/util';
import { getKCByName } from '../../lib/util/getKCByName';
import getOSItem from '../../lib/util/getOSItem';
import { handleMahojiConfirmation } from '../../lib/util/handleMahojiConfirmation';
import { minionStatsEmbed } from '../../lib/util/minionStatsEmbed';
import { checkPeakTimes } from '../../lib/util/minionUtils';
import {
	achievementDiaryCommand,
	claimAchievementDiaryCommand
} from '../lib/abstracted_commands/achievementDiaryCommand';
import { cancelTaskCommand } from '../lib/abstracted_commands/cancelTaskCommand';
import { dailyCommand } from '../lib/abstracted_commands/dailyCommand';
import { feedHammyCommand } from '../lib/abstracted_commands/hammyCommand';
import { minionBuyCommand } from '../lib/abstracted_commands/minionBuyCommand';
import { minionStatusCommand } from '../lib/abstracted_commands/minionStatusCommand';
import { ownedItemOption, skillOption } from '../lib/mahojiCommandOptions';
import type { OSBMahojiCommand } from '../lib/util';
import { patronMsg } from '../mahojiSettings';

const patMessages = [
	'You pat {name} on the head.',
	'You gently pat {name} on the head, they look back at you happily.',
	'You pat {name} softly on the head, and thank them for their hard work.',
	'You pat {name} on the head, they feel happier now.',
	'After you pat {name}, they feel more motivated now and in the mood for PVM.',
	'You give {name} head pats, they get comfortable and start falling asleep.'
];

const randomPatMessage = (minionName: string) => randArrItem(patMessages).replace('{name}', minionName);

export async function getUserInfo(user: MUser) {
	const leaguesRanking = await prisma.user.count({
		where: {
			leagues_completed_tasks_count: {
				gte: user.user.leagues_completed_tasks_count
			}
		}
	});
	const clRank = await prisma.user.count({
		where: {
			cl_percent: {
				gte: user.user.cl_percent ?? 0
			}
		}
	});

	const bitfields = `${(user.bitfield as BitField[])
		.map(i => BitFieldData[i])
		.filter(notEmpty)
		.map(i => i.name)
		.join(', ')}`;

	const task = minionActivityCache.get(user.id);
	const taskText = task ? `${task.type}` : 'None';

	const userBadges = user.user.badges.map(i => badges[i]);

	const result = {
		perkTier: user.perkTier(),
		isBlacklisted: BLACKLISTED_USERS.has(user.id),
		badges: userBadges,
		bitfields,
		currentTask: taskText
	};

	return {
		...result,
		everythingString: `${user.badgedUsername}[${user.id}]
**Current Trip:** ${taskText}
**Blacklisted:** ${result.isBlacklisted}
**Badges:** ${result.badges.join(' ')}
**Bitfields:** ${result.bitfields}
**Leagues:** ${user.user.leagues_completed_tasks_ids.length} tasks, (Rank ${leaguesRanking > 500 ? 'Unranked! Finish more tasks!' : formatOrdinal(leaguesRanking)})
**CL:** ${user.user.cl_percent}% (${clRank > 500 ? 'Unranked! Get more CL slots completed!' : formatOrdinal(clRank)})
`
	};
}

export const minionCommand: OSBMahojiCommand = {
	name: 'minion',
	description: 'Manage and control your minion.',
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'buy',
			description: 'Buy a minion so you can start playing the bot!'
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'status',
			description: 'View the status of your minion.'
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'stats',
			description: 'Check the stats of your minion.'
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'achievementdiary',
			description: 'Manage your achievement diary.',
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: 'diary',
					description: 'The achievement diary name.',
					required: false,
					choices: diaries.map(i => ({ name: i.name, value: i.name }))
				},
				{
					type: ApplicationCommandOptionType.Boolean,
					name: 'claim',
					description: 'Claim your rewards?',
					required: false
				}
			]
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'cancel',
			description: 'Cancel your current trip.'
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'set_icon',
			description: 'Set the icon for your minion.',
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: 'icon',
					description: 'The icon you want to pick.',
					required: true
				}
			]
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'set_name',
			description: 'Set the name of your minion.',
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: 'name',
					description: 'The name you want to pick.',
					required: true
				}
			]
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'level',
			description: 'Check your level/XP in a skill.',
			options: [
				{
					...skillOption,
					required: true
				}
			]
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'kc',
			description: 'Check your KC.',
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: 'name',
					description: 'The monster/thing you want to check your KC of.',
					required: true,
					autocomplete: async (value: string) => {
						return [...effectiveMonsters, ...Minigames, ...creatures]
							.filter(i => (!value ? true : i.aliases.some(alias => alias.includes(value.toLowerCase()))))
							.map(i => ({ name: i.name, value: i.name }));
					}
				}
			]
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'charge',
			description: 'Charge an item.',
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: 'item',
					description: 'The item you want to charge',
					required: false,
					choices: degradeableItems.map(i => ({ name: i.item.name, value: i.item.name }))
				},
				{
					type: ApplicationCommandOptionType.Integer,
					name: 'amount',
					description: 'The amount you want to charge',
					required: false
				}
			]
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'daily',
			description: 'Claim some daily free GP.'
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'train',
			description: 'Select what combat style you want to train.',
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: 'style',
					description: 'The attack style you want to train with',
					required: true,
					choices: allPossibleStyles.map(i => ({ name: i, value: i }))
				}
			]
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'pat',
			description: 'Pat your minion on the head!'
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'blowpipe',
			description: 'Charge and uncharge your blowpipe.',
			options: [
				{
					type: ApplicationCommandOptionType.Boolean,
					name: 'remove_darts',
					description: 'Remove all darts from your blowpipe',
					required: false
				},
				{
					type: ApplicationCommandOptionType.Boolean,
					name: 'uncharge',
					description: 'Remove all darts and scales from your blowpipe',
					required: false
				},
				{
					type: ApplicationCommandOptionType.String,
					name: 'add',
					description: 'Add darts or scales to your blowpipe',
					required: false,
					choices: [...blowpipeDarts, getOSItem("Zulrah's scales")].map(i => ({
						name: i.name,
						value: i.name
					}))
				},
				{
					type: ApplicationCommandOptionType.Integer,
					name: 'quantity',
					description: 'The quantity of darts/scales to add',
					required: false,
					min_value: 1
				}
			]
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'info',
			description: 'View general information about your account and minion.'
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'peak',
			description: 'View Peak time activity for the Wilderness.'
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'feed_hammy',
			description: 'Feed an item to your Hammy pet.',
			options: [
				{
					...ownedItemOption()
				}
			]
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'mastery',
			description: 'View your minions mastery.'
		}
	],
	run: async ({
		userID,
		options,
		interaction,
		channelID
	}: CommandRunOptions<{
		stats?: { stat?: string };
		achievementdiary?: { diary?: string; claim?: boolean };
		bankbg?: { name?: string };
		cancel?: {};
		set_icon?: { icon: string };
		set_name?: { name: string };
		level?: { skill: string };
		kc?: { name: string };
		buy?: {};
		charge?: { item?: string; amount?: number };
		daily?: {};
		train?: { style: AttackStyles };
		pat?: {};
		blowpipe?: { remove_darts?: boolean; uncharge?: boolean; add?: string; quantity?: number };
		status?: {};
		info?: {};
		peak?: {};
		feed_hammy?: {
			item: string;
		};
		mastery?: {};
	}>) => {
		const user = await mUserFetch(userID);
		const perkTier = user.perkTier();

		if (options.info) return (await getUserInfo(user)).everythingString;
		if (options.status) return minionStatusCommand(user);

		if (options.stats) {
			return { embeds: [await minionStatsEmbed(user)] };
		}

		if (options.achievementdiary) {
			if (options.achievementdiary.claim) {
				return claimAchievementDiaryCommand(user, options.achievementdiary.diary ?? '');
			}
			return achievementDiaryCommand(user, options.achievementdiary.diary ?? '');
		}

		if (options.cancel) return cancelTaskCommand(user, interaction);

		if (options.set_icon) {
			if (perkTier < PerkTier.Four) return patronMsg(PerkTier.Four);

			const res = FormattedCustomEmoji.exec(options.set_icon.icon);
			if (!res || !res[0]) return "That's not a valid emoji.";

			await handleMahojiConfirmation(interaction, 'Icons cannot be inappropriate or NSFW. Do you understand?');
			await user.update({
				minion_icon: res[0]
			});

			return `Changed your minion icon to ${res}.`;
		}
		if (options.set_name) {
			if (!isValidNickname(options.set_name.name)) return "That's not a valid name for your minion.";
			await user.update({
				minion_name: options.set_name.name
			});
			return `Renamed your minion to ${user.minionName}.`;
		}

		if (options.level) {
			const skill = Object.values(Skills).find(i => i.id === options.level?.skill);
			if (!skill) return 'Invalid skill.';
			const level = user.skillLevel(skill.id);
			const xp = Number(user.user[`skills_${skill.id}`]);

			let str = `${skill.emoji} Your ${skill.name} level is **${level}** (${xp.toLocaleString()} XP).`;
			if (level < MAX_LEVEL) {
				const xpToLevel = convertLVLtoXP(level + 1) - xp;
				str += ` ${xpToLevel.toLocaleString()} XP away from level ${level + 1}`;
			}
			return str;
		}

		if (options.kc) {
			const [kcName, kcAmount] = await getKCByName(user, options.kc.name);
			if (!kcName) {
				return "That's not a valid monster, minigame or hunting creature.";
			}
			return `Your ${kcName} KC is: ${kcAmount}.`;
		}

		if (options.buy) return minionBuyCommand(user);

		if (options.charge) {
			return degradeableItemsCommand(interaction, user, options.charge.item, options.charge.amount);
		}
		if (options.daily) {
			return dailyCommand(interaction, channelID, user);
		}
		if (options.train) return trainCommand(user, options.train.style);
		if (options.pat) return randomPatMessage(user.minionName);
		if (options.blowpipe) {
			return blowpipeCommand(
				user,
				options.blowpipe.remove_darts,
				options.blowpipe.uncharge,
				options.blowpipe.add,
				options.blowpipe.quantity
			);
		}
		if (options.feed_hammy) return feedHammyCommand(interaction, user, options.feed_hammy.item);

		if (options.peak) return checkPeakTimes();

		if (options.mastery) {
			const { masteryFactors, totalMastery } = await calculateMastery(user, await MUserStats.fromID(user.id));
			const substr = masteryFactors.map(i => `${bold(i.name)}: ${i.percentage.toFixed(2)}%`).join('\n');
			return `You have ${totalMastery.toFixed(2)}% mastery.

${substr}`;
		}

		return 'Unknown command';
	}
};
