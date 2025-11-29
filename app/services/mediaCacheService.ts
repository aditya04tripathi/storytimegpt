import * as FileSystem from "expo-file-system";
import { Paths } from "expo-file-system";
import { logError } from "./errorLogger";

const CACHE_DIR = `${Paths.cache}media/`;
const MAX_CACHE_SIZE = 100 * 1024 * 1024;

type CacheEntry = {
	url: string;
	localUri: string;
	size: number;
	lastAccessed: number;
};

class MediaCacheService {
	private cache: Map<string, CacheEntry> = new Map();

	async ensureCached(url: string): Promise<{ localUri: string }> {
		const cached = this.cache.get(url);
		if (cached) {
			cached.lastAccessed = Date.now();
			return { localUri: cached.localUri };
		}

		const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
		if (!dirInfo.exists) {
			await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
		}

		const filename = url.split("/").pop() || "file";
		const localUri = `${CACHE_DIR}${filename}`;

		try {
			const downloadResult = await FileSystem.downloadAsync(url, localUri);
			const fileInfo = await FileSystem.getInfoAsync(localUri);

			if (fileInfo.exists && fileInfo.size) {
				this.cache.set(url, {
					url,
					localUri: downloadResult.uri,
					size: fileInfo.size,
					lastAccessed: Date.now(),
				});

				await this.evictIfNeeded();

				return { localUri: downloadResult.uri };
			}
		} catch (error) {
			await logError(error, "low", {
				action: "cache_download",
				metadata: { url },
			});
		}

		return { localUri: url };
	}

	private async evictIfNeeded() {
		let totalSize = Array.from(this.cache.values()).reduce(
			(sum, entry) => sum + entry.size,
			0,
		);

		if (totalSize <= MAX_CACHE_SIZE) {
			return;
		}

		const entries = Array.from(this.cache.entries()).sort(
			([, a], [, b]) => a.lastAccessed - b.lastAccessed,
		);

		for (const [url, entry] of entries) {
			if (totalSize <= MAX_CACHE_SIZE * 0.8) {
				break;
			}

			try {
				await FileSystem.deleteAsync(entry.localUri, { idempotent: true });
				this.cache.delete(url);
				totalSize -= entry.size;
			} catch (error) {
				await logError(error, "low", {
					action: "cache_eviction",
					metadata: { url },
				});
			}
		}
	}

	async clearCache() {
		try {
			await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true });
			this.cache.clear();
		} catch (error) {
			await logError(error, "low", {
				action: "clear_cache",
			});
		}
	}
}

export const mediaCacheService = new MediaCacheService();
