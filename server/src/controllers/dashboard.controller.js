const { getChatMessageCount, listRecentActivity } = require("../models/activity.model");
const {
  findMostRecentlyViewedJob,
  getUserAnalysisStats,
  listAnalysisJobsForUser,
} = require("../models/repository.model");

async function getDashboard(req, res) {
  const [jobs, activity, continueJob, analysisStats, chatCount] = await Promise.all([
    listAnalysisJobsForUser(req.userId),
    listRecentActivity(req.userId, 100),
    findMostRecentlyViewedJob(req.userId),
    getUserAnalysisStats(req.userId),
    getChatMessageCount(req.userId),
  ]);

  res.json({
    stats: {
      repoCount: analysisStats.repoCount,
      totalAnalyses: analysisStats.totalAnalyses,
      chatCount,
      avgHealth: analysisStats.avgHealth,
    },
    recent: jobs.slice(0, 20),
    activity,
    continue: continueJob,
  });
}

module.exports = { getDashboard };
