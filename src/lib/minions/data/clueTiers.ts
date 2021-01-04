import { Clues } from 'oldschooljs';

const { Beginner, Easy, Medium, Hard, Elite, Master } = Clues;

import { Time } from '../../constants';
import { GrandmasterClueTable } from '../../simulation/grandmasterClue';
import itemID from '../../util/itemID';
import { ClueTier } from '../types';

const ClueTiers: ClueTier[] = [
	{
		name: 'Beginner',
		table: Beginner,
		id: 23245,
		scrollID: 23182,
		timeToFinish: Time.Minute * 4.5,
		mimicChance: false
	},
	{
		name: 'Easy',
		table: Easy,
		id: 20546,
		scrollID: 2677,
		timeToFinish: Time.Minute * 6.5,
		milestoneReward: {
			itemReward: itemID('Large spade'),
			scoreNeeded: 500
		},
		mimicChance: false
	},
	{
		name: 'Medium',
		table: Medium,
		id: 20545,
		scrollID: 2801,
		timeToFinish: Time.Minute * 9,
		milestoneReward: {
			itemReward: itemID('Clueless scroll'),
			scoreNeeded: 400
		},
		mimicChance: false
	},
	{
		name: 'Hard',
		table: Hard,
		id: 20544,
		scrollID: 2722,
		timeToFinish: Time.Minute * 12.5,
		mimicChance: false
	},
	{
		name: 'Elite',
		table: Elite,
		id: 20543,
		scrollID: 12073,
		timeToFinish: Time.Minute * 15.7,
		milestoneReward: {
			itemReward: itemID('Heavy casket'),
			scoreNeeded: 200
		},
		mimicChance: 35
	},
	{
		name: 'Master',
		table: Master,
		id: 19836,
		scrollID: 19835,
		timeToFinish: Time.Minute * 19.3,
		milestoneReward: {
			itemReward: itemID('Scroll sack'),
			scoreNeeded: 100
		},
		mimicChance: 15
	},
	{
		name: 'Grandmaster',
		table: GrandmasterClueTable,
		id: 19838,
		scrollID: 19837,
		timeToFinish: Time.Minute * 29.3,
		mimicChance: false
	}
];

export default ClueTiers;
