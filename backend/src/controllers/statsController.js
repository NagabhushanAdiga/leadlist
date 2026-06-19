import { LeadModel } from '../models/leadModel.js'

export const StatsController = {
  async get(_req, res) {
    res.json(await LeadModel.getStats())
  },
}
