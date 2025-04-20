// Types
export interface UserStats {
    userId: string;
    nickname: string;
    classic: {
        clicks: number;
        lastUpdated: number;
    };
    bdsm: {
        clicks: number;
        lastUpdated: number;
    };
    slot: {
        clicks: number;
        lastUpdated: number;
    };
}

interface GlobalStats {
    [key: string]: {
        totalClicks: number;
    };
}

// Constants
const USER_STATS_KEY = 'slizlik_user_stats';

// Storage helpers
const getStoredStats = (): UserStats | null => {
    const stored = localStorage.getItem(USER_STATS_KEY);
    return stored ? JSON.parse(stored) : null;
};

const saveStats = (stats: UserStats) => {
    localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
};

// Main functions
export const updateUserStats = (mode: string, nickname: string): UserStats => {
    try {
        const userId = `user_${Date.now()}`;
        const timestamp = Date.now();
        
        let stats = getStoredStats();
        
        if (!stats) {
            stats = {
                userId,
                nickname,
                classic: { clicks: 0, lastUpdated: 0 },
                bdsm: { clicks: 0, lastUpdated: 0 },
                slot: { clicks: 0, lastUpdated: 0 }
            };
        }

        // Update the specific mode stats
        const modeStats = stats[mode as keyof UserStats] as { clicks: number; lastUpdated: number };
        modeStats.clicks += 1;
        modeStats.lastUpdated = timestamp;

        saveStats(stats);
        return stats;
    } catch (error) {
        console.error('Error updating stats:', error);
        throw error;
    }
};

export const getUserStats = (): UserStats | null => {
    try {
        return getStoredStats();
    } catch (error) {
        console.error('Error getting user stats:', error);
        return null;
    }
};

export const getGlobalStats = async (): Promise<GlobalStats | null> => {
    try {
        const response = await fetch('/api/stats/global');
        if (!response.ok) {
            throw new Error('Failed to fetch global stats');
        }
        
        const stats = await response.json();
        return stats;
    } catch (error) {
        console.error('Error getting global stats:', error);
        return null;
    }
};