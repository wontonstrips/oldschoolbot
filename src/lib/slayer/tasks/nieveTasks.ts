import { Monsters } from 'oldschooljs';

import killableMonsters from '../../minions/data/killableMonsters';
import { Ignecarus } from '../../minions/data/killableMonsters/custom/bosses/Ignecarus';
import { KalphiteKingMonster } from '../../minions/data/killableMonsters/custom/bosses/KalphiteKing';
import { BSOMonsters } from '../../minions/data/killableMonsters/custom/customMonsters';
import { SlayerTaskUnlocksEnum } from '../slayerUnlocks';
import type { AssignableSlayerTask } from '../types';
import { bossTasks } from './bossTasks';
import { polyporeTasks } from './polyporeTasks';

export const nieveTasks: AssignableSlayerTask[] = [
	{
		monster: Monsters.AberrantSpectre,
		amount: [120, 185],
		extendedAmount: [200, 250],
		extendedUnlockId: SlayerTaskUnlocksEnum.SmellYaLater,
		weight: 6,
		monsters: [Monsters.AberrantSpectre.id, Monsters.DeviantSpectre.id],
		combatLevel: 65,
		slayerLevel: 60,
		questPoints: 1,
		unlocked: true
	},
	{
		monster: Monsters.AbyssalDemon,
		amount: [120, 185],
		extendedAmount: [200, 250],
		extendedUnlockId: SlayerTaskUnlocksEnum.AugmentMyAbbies,
		weight: 9,
		monsters: [Monsters.AbyssalDemon.id, Monsters.AbyssalSire.id, BSOMonsters.Malygos.id],
		combatLevel: 85,
		slayerLevel: 85,
		questPoints: 1,
		unlocked: true
	},
	{
		monster: Monsters.AdamantDragon,
		amount: [3, 7],
		extendedAmount: [20, 30],
		extendedUnlockId: SlayerTaskUnlocksEnum.AdamindSomeMore,
		weight: 2,
		monsters: [Monsters.AdamantDragon.id],
		questPoints: 205,
		unlocked: true
	},
	{
		monster: Monsters.Ankou,
		amount: [50, 90],
		extendedAmount: [91, 150],
		extendedUnlockId: SlayerTaskUnlocksEnum.AnkouVeryMuch,
		weight: 5,
		monsters: [Monsters.Ankou.id],
		combatLevel: 40,
		unlocked: true
	},
	{
		monster: Monsters.Aviansie,
		amount: [120, 185],
		extendedAmount: [200, 250],
		extendedUnlockId: SlayerTaskUnlocksEnum.BirdsOfAFeather,
		weight: 6,
		monsters: [Monsters.Aviansie.id, Monsters.Kreearra.id],
		unlocked: false
	},
	{
		monster: Monsters.Basilisk,
		amount: [120, 185],
		extendedAmount: [200, 250],
		extendedUnlockId: SlayerTaskUnlocksEnum.Basilonger,
		weight: 6,
		monsters: [Monsters.Basilisk.id, Monsters.BasiliskKnight.id],
		slayerLevel: 40,
		unlocked: false
	},
	{
		monster: Monsters.BlackDemon,
		amount: [120, 185],
		extendedAmount: [200, 250],
		extendedUnlockId: SlayerTaskUnlocksEnum.ItsDarkInHere,
		weight: 9,
		monsters: [Monsters.BlackDemon.id, Monsters.DemonicGorilla.id, Monsters.Skotizo.id],
		combatLevel: 80,
		unlocked: true
	},
	{
		monster: Monsters.BlackDragon,
		amount: [10, 20],
		weight: 6,
		monsters: [
			Monsters.BlackDragon.id,
			Monsters.BabyBlackDragon.id,
			Monsters.BrutalBlackDragon.id,
			Monsters.KingBlackDragon.id,
			Ignecarus.id,
			BSOMonsters.QueenBlackDragon.id
		],
		extendedAmount: [40, 60],
		extendedUnlockId: SlayerTaskUnlocksEnum.FireAndDarkness,
		combatLevel: 80,
		questPoints: 34,
		unlocked: true
	},
	{
		monster: Monsters.Bloodveld,
		amount: [120, 185],
		extendedAmount: [200, 250],
		extendedUnlockId: SlayerTaskUnlocksEnum.BleedMeDry,
		weight: 9,
		monsters: [Monsters.Bloodveld.id, Monsters.MutatedBloodveld.id],
		combatLevel: 50,
		slayerLevel: 50,
		questPoints: 1,
		unlocked: true
	},
	{
		monster: Monsters.BlueDragon,
		amount: [120, 185],
		weight: 4,
		monsters: [
			Monsters.BlueDragon.id,
			Monsters.BabyBlueDragon.id,
			Monsters.BrutalBlueDragon.id,
			Monsters.Vorkath.id
		],
		combatLevel: 65,
		questPoints: 34,
		unlocked: true
	},
	{
		monster: Monsters.BrineRat,
		amount: [120, 185],
		weight: 3,
		monsters: [Monsters.BrineRat.id],
		combatLevel: 45,
		slayerLevel: 47,
		questPoints: 4,
		unlocked: true
	},
	{
		monster: Monsters.CaveHorror,
		amount: [120, 180],
		extendedAmount: [200, 250],
		extendedUnlockId: SlayerTaskUnlocksEnum.Horrorific,
		weight: 5,
		monsters: [Monsters.CaveHorror.id],
		combatLevel: 85,
		slayerLevel: 58,
		questPoints: 11,
		unlocked: true
	},
	{
		monster: Monsters.CaveKraken,
		amount: [100, 120],
		extendedAmount: [150, 200],
		extendedUnlockId: SlayerTaskUnlocksEnum.KrackOn,
		weight: 6,
		monsters: [Monsters.CaveKraken.id, Monsters.Kraken.id, BSOMonsters.SeaKraken.id],
		combatLevel: 80,
		slayerLevel: 87,
		unlocked: true
	},
	{
		monster: Monsters.Dagannoth,
		amount: [120, 185],
		weight: 8,
		monsters: [
			Monsters.Dagannoth.id,
			Monsters.DagannothSpawn.id,
			Monsters.DaganothFledgeling.id,
			Monsters.DagannothSupreme.id,
			Monsters.DagannothRex.id,
			Monsters.DagannothPrime.id
		],
		combatLevel: 75,
		questPoints: 2,
		unlocked: true
	},
	{
		monster: Monsters.DarkBeast,
		amount: [10, 20],
		extendedAmount: [110, 135],
		extendedUnlockId: SlayerTaskUnlocksEnum.NeedMoreDarkness,
		weight: 5,
		monsters: [Monsters.DarkBeast.id],
		combatLevel: 90,
		slayerLevel: 90,
		questPoints: 24,
		unlocked: true
	},
	{
		monster: Monsters.Drake,
		amount: [30, 95],
		weight: 7,
		monsters: [Monsters.Drake.id],
		slayerLevel: 84,
		unlocked: true
	},
	{
		monster: Monsters.DustDevil,
		amount: [120, 185],
		extendedAmount: [200, 250],
		extendedUnlockId: SlayerTaskUnlocksEnum.ToDustYouShallReturn,
		weight: 6,
		monsters: [Monsters.DustDevil.id],
		combatLevel: 70,
		slayerLevel: 65,
		questPoints: 12,
		unlocked: true
	},
	{
		monster: Monsters.ElfWarrior,
		amount: [60, 90],
		weight: 4,
		monsters: [
			Monsters.ElfWarrior.id,
			Monsters.IorwerthArcher.id,
			Monsters.ElfArcher.id,
			Monsters.IorwerthWarrior.id,
			Monsters.Mourner.id
		],
		combatLevel: 70,
		questPoints: 12,
		unlocked: true
	},
	{
		monster: Monsters.FireGiant,
		amount: [120, 185],
		weight: 9,
		monsters: [Monsters.FireGiant.id],
		combatLevel: 65,
		unlocked: true
	},
	{
		monster: Monsters.FossilIslandWyvernSpitting,
		amount: [5, 25],
		extendedAmount: [55, 75],
		extendedUnlockId: SlayerTaskUnlocksEnum.WyverNotherTwo,
		weight: 5,
		monsters: [
			Monsters.FossilIslandWyvernAncient.id,
			Monsters.FossilIslandWyvernLongTailed.id,
			Monsters.FossilIslandWyvernSpitting.id,
			Monsters.FossilIslandWyvernTaloned.id
		],
		combatLevel: 60,
		slayerLevel: 66,
		questPoints: 3,
		unlocked: true
	},
	{
		monster: Monsters.Gargoyle,
		amount: [120, 185],
		extendedAmount: [200, 250],
		extendedUnlockId: SlayerTaskUnlocksEnum.GetSmashed,
		weight: 6,
		monsters: [Monsters.Gargoyle.id, Monsters.GrotesqueGuardians.id],
		combatLevel: 80,
		slayerLevel: 75,
		questPoints: 1,
		unlocked: true
	},
	{
		monster: Monsters.GreaterDemon,
		amount: [120, 185],
		extendedAmount: [200, 250],
		extendedUnlockId: SlayerTaskUnlocksEnum.GreaterChallenge,
		weight: 7,
		monsters: [
			Monsters.GreaterDemon.id,
			Monsters.KrilTsutsaroth.id,
			Monsters.Skotizo.id,
			Monsters.TormentedDemon.id
		],
		combatLevel: 75,
		unlocked: true
	},
	{
		monster: Monsters.Hellhound,
		amount: [120, 185],
		weight: 8,
		monsters: [Monsters.Hellhound.id, Monsters.Cerberus.id],
		combatLevel: 75,
		unlocked: true
	},
	{
		monster: Monsters.IronDragon,
		amount: [30, 60],
		extendedAmount: [60, 100],
		extendedUnlockId: SlayerTaskUnlocksEnum.PedalToTheMetals,
		weight: 5,
		monsters: [Monsters.IronDragon.id],
		combatLevel: 80,
		questPoints: 34,
		unlocked: true
	},
	{
		monster: Monsters.KalphiteWorker,
		amount: [120, 185],
		weight: 9,
		monsters: [
			Monsters.KalphiteWorker.id,
			Monsters.KalphiteSoldier.id,
			Monsters.KalphiteGuardian.id,
			Monsters.KalphiteQueen.id,
			KalphiteKingMonster.id
		],
		combatLevel: 15,
		unlocked: true
	},
	{
		monster: Monsters.Kurask,
		amount: [120, 185],
		weight: 3,
		monsters: [Monsters.Kurask.id],
		combatLevel: 65,
		slayerLevel: 70,
		unlocked: true
	},
	{
		monster: Monsters.Lizardman,
		amount: [90, 120],
		weight: 8,
		monsters: [Monsters.Lizardman.id, Monsters.LizardmanBrute.id, Monsters.LizardmanShaman.id],
		unlocked: false
	},
	{
		monster: Monsters.ScarabMage,
		amount: [30, 60],
		extendedAmount: [130, 170],
		extendedUnlockId: SlayerTaskUnlocksEnum.GetScabarightOnIt,
		weight: 4,
		monsters: [Monsters.ScarabMage.id, Monsters.LocustRider.id],
		combatLevel: 85,
		questPoints: 7,
		unlocked: true
	},
	{
		monster: Monsters.MithrilDragon,
		amount: [4, 8],
		extendedAmount: [25, 35],
		extendedUnlockId: SlayerTaskUnlocksEnum.IReallyMithYou,
		weight: 5,
		monsters: [Monsters.MithrilDragon.id],
		unlocked: false
	},
	{
		monster: Monsters.Zygomite,
		amount: [10, 25],
		weight: 2,
		monsters: [Monsters.Zygomite.id, Monsters.AncientZygomite.id],
		combatLevel: 60,
		slayerLevel: 57,
		questPoints: 3,
		unlocked: true
	},
	{
		monster: Monsters.Nechryael,
		amount: [110, 170],
		extendedAmount: [200, 250],
		extendedUnlockId: SlayerTaskUnlocksEnum.NechsPlease,
		weight: 7,
		monsters: [Monsters.Nechryael.id, Monsters.GreaterNechryael.id],
		combatLevel: 85,
		slayerLevel: 80,
		questPoints: 1,
		unlocked: true
	},
	{
		monster: Monsters.RedDragon,
		amount: [30, 80],
		weight: 5,
		monsters: [Monsters.RedDragon.id, Monsters.BabyRedDragon.id, Monsters.BrutalRedDragon.id],
		questPoints: 34,
		combatLevel: 68,
		unlocked: false
	},
	{
		monster: Monsters.RuneDragon,
		amount: [3, 6],
		extendedAmount: [30, 60],
		extendedUnlockId: SlayerTaskUnlocksEnum.RUUUUUNE,
		weight: 2,
		monsters: [Monsters.RuneDragon.id],
		questPoints: 205,
		unlocked: true
	},
	{
		monster: Monsters.SkeletalWyvern,
		amount: [5, 15],
		extendedAmount: [50, 70],
		extendedUnlockId: SlayerTaskUnlocksEnum.WyverNotherOne,
		weight: 5,
		monsters: [Monsters.SkeletalWyvern.id],
		combatLevel: 70,
		slayerLevel: 72,
		questPoints: 1,
		unlocked: true
	},
	{
		monster: Monsters.SmokeDevil,
		amount: [120, 185],
		weight: 7,
		monsters: [Monsters.SmokeDevil.id, Monsters.ThermonuclearSmokeDevil.id],
		combatLevel: 85,
		slayerLevel: 93,
		unlocked: true
	},
	{
		monster: Monsters.SpiritualRanger,
		amount: [120, 185],
		extendedAmount: [181, 250],
		extendedUnlockId: SlayerTaskUnlocksEnum.SpiritualFervour,
		weight: 6,
		monsters: [Monsters.SpiritualRanger.id, Monsters.SpiritualWarrior.id, Monsters.SpiritualMage.id],
		combatLevel: 60,
		slayerLevel: 63,
		questPoints: 3,
		unlocked: true
	},
	{
		monster: Monsters.SteelDragon,
		amount: [30, 60],
		extendedAmount: [40, 60],
		extendedUnlockId: SlayerTaskUnlocksEnum.PedalToTheMetals,
		weight: 5,
		monsters: [Monsters.SteelDragon.id],
		levelRequirements: killableMonsters.find(k => k.id === Monsters.SteelDragon.id)?.levelRequirements,
		combatLevel: 85,
		questPoints: 34,
		unlocked: true
	},
	{
		monster: Monsters.Suqah,
		amount: [120, 185],
		extendedAmount: [186, 250],
		extendedUnlockId: SlayerTaskUnlocksEnum.SuqANotherOne,
		weight: 8,
		monsters: [Monsters.Suqah.id],
		combatLevel: 85,
		questPoints: 12,
		unlocked: true
	},
	{
		monster: Monsters.MountainTroll,
		amount: [120, 185],
		weight: 6,
		monsters: [Monsters.MountainTroll.id, Monsters.IceTroll.id, Monsters.TrollGeneral.id],
		combatLevel: 60,
		unlocked: true
	},
	{
		monster: Monsters.Turoth,
		amount: [120, 185],
		weight: 3,
		monsters: [Monsters.Turoth.id],
		combatLevel: 60,
		slayerLevel: 55,
		unlocked: true
	},
	{
		monster: Monsters.TzHaarKet,
		amount: [110, 180],
		weight: 10,
		monsters: [Monsters.TzHaarKet.id, Monsters.TzHaarXil.id, Monsters.TzHaarMej.id],
		unlocked: false
	},
	{
		monster: Monsters.FeralVampyre,
		amount: [110, 170],
		extendedAmount: [200, 250],
		extendedUnlockId: SlayerTaskUnlocksEnum.MoreAtStake,
		weight: 6,
		monsters: [
			Monsters.FeralVampyre.id,
			Monsters.VampyreJuvinate.id,
			Monsters.Vyrewatch.id,
			Monsters.VyrewatchSentinel.id,
			BSOMonsters.VladimirDrakan.id
		],
		questPoints: 1,
		unlocked: false
	},
	{
		monster: Monsters.Wyrm,
		amount: [80, 145],
		weight: 7,
		monsters: [Monsters.Wyrm.id],
		slayerLevel: 62,
		unlocked: true
	},
	...bossTasks,
	...polyporeTasks,
	{
		monster: Monsters.Araxyte,
		amount: [40, 60],
		extendedAmount: [200, 250],
		extendedUnlockId: SlayerTaskUnlocksEnum.MoreEyesThanSense,
		weight: 8,
		monsters: [Monsters.Araxyte.id, Monsters.Araxxor.id],
		unlocked: true,
		slayerLevel: 92
	},
	...bossTasks
];
