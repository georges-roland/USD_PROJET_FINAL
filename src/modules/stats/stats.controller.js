import * as statsService from './stats.service.js';

export const getMetrics = async (req, res) => {
  try {
    const metrics = await statsService.getDashboardMetrics();
    res.status(200).json({ success: true, metrics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
