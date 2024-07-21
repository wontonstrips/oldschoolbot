import { Time, randInt, shuffleArr } from 'e';

import { runTameTask } from '../tasks/tames/tameTasks';
import { processPendingActivities } from './Task';
import { PeakTier, globalConfig } from './constants';

import { Stopwatch } from '@oldschoolgg/toolkit';
import { logError } from './util/logError';

export interface Peak {
	startTime: number;
	finishTime: number;
	peakTier: PeakTier;
}

/**
 * Tickers should idempotent, and be able to run at any time.
 */
export const tickers: {
	name: string;
	startupWait?: number;
	interval: number;
	timer: NodeJS.Timeout | null;
	cb: () => Promise<unknown>;
}[] = [
	{
		name: 'minion_activities',
		startupWait: Time.Second * 10,
		timer: null,
		interval: globalConfig.isProduction ? Time.Second * 5 : 500,
		cb: async () => {
			await processPendingActivities();
		}
	},
	{
		name: 'wilderness_peak_times',
		timer: null,
		interval: Time.Hour * 24,
		cb: async () => {
			let hoursUsed = 0;
			let peakInterval: Peak[] = [];
			const peakTiers: PeakTier[] = [PeakTier.High, PeakTier.Medium, PeakTier.Low];

			// Divide the current day into interverals
			for (let i = 0; i <= 10; i++) {
				const randomedTime = randInt(1, 2);
				const [peakTier] = shuffleArr(peakTiers);
				const peak: Peak = {
					startTime: randomedTime,
					finishTime: randomedTime,
					peakTier
				};
				peakInterval.push(peak);
				hoursUsed += randomedTime;
			}

			const lastPeak: Peak = {
				startTime: 24 - hoursUsed,
				finishTime: 24 - hoursUsed,
				peakTier: PeakTier.Low
			};

			peakInterval.push(lastPeak);

			peakInterval = shuffleArr(peakInterval);

			let currentTime = new Date().getTime();

			for (const peak of peakInterval) {
				peak.startTime = currentTime;
				currentTime += peak.finishTime * Time.Hour;
				peak.finishTime = currentTime;
			}

			globalClient._peakIntervalCache = peakInterval;
		}
	},
	{
		name: 'tame_activities',
		startupWait: Time.Second * 15,
		timer: null,
		interval: Time.Second * 5,
		cb: async () => {
			const tameTasks = await prisma.tameActivity.findMany({
				where: {
					finish_date: globalConfig.isProduction
						? {
								lt: new Date()
							}
						: undefined,
					completed: false
				},
				include: {
					tame: true
				},
				take: 5
			});

			await prisma.tameActivity.updateMany({
				where: {
					id: {
						in: tameTasks.map(i => i.id)
					}
				},
				data: {
					completed: true
				}
			});

			for (const task of tameTasks) {
				runTameTask(task, task.tame);
			}
		}
	}
];

export function initTickers() {
	for (const ticker of tickers) {
		if (ticker.timer !== null) clearTimeout(ticker.timer);
		const fn = async () => {
			try {
				if (globalClient.isShuttingDown) return;
				const stopwatch = new Stopwatch().start();
				await ticker.cb();
				stopwatch.stop();
				if (stopwatch.duration > 100) {
					debugLog(`Ticker ${ticker.name} took ${stopwatch}`);
				}
			} catch (err) {
				logError(err);
				debugLog(`${ticker.name} ticker errored`, { type: 'TICKER' });
			} finally {
				ticker.timer = setTimeout(fn, ticker.interval);
			}
		};
		setTimeout(() => {
			fn();
		}, ticker.startupWait ?? 1);
	}
}
