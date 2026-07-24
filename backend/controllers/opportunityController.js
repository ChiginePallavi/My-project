import Opportunity from '../models/opportunity.js';

const normalizeText = (value = '') => value.toString().trim().toLowerCase();

const validateOpportunityPayload = (payload) => {
  const requiredFields = ['title', 'company', 'category', 'description'];
  const missing = requiredFields.filter((field) => !payload[field] || !payload[field].toString().trim());

  if (missing.length > 0) {
    return {
      valid: false,
      message: `Missing required fields: ${missing.join(', ')}`
    };
  }

  return { valid: true };
};

export const getAllOpportunities = async (req, res, next) => {
  try {
    const { search = '', page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
    const query = {};

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { company: regex },
        { category: regex },
        { location: regex },
        { description: regex }
      ];
    }

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * pageSize;
    const sortOrder = order === 'desc' ? -1 : 1;

    const [opportunities, total] = await Promise.all([
      Opportunity.find(query)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(pageSize),
      Opportunity.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: opportunities.length,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize) || 1,
      data: opportunities
    });
  } catch (error) {
    next(error);
  }
};

export const searchOpportunities = async (req, res, next) => {
  try {
    const { name = '' } = req.query;
    const searchTerm = normalizeText(name);

    if (!searchTerm) {
      const opportunities = await Opportunity.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: opportunities.length, data: opportunities });
    }

    const regex = new RegExp(searchTerm, 'i');
    const opportunities = await Opportunity.find({
      $or: [
        { title: regex },
        { company: regex },
        { category: regex },
        { location: regex }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: opportunities.length, data: opportunities });
  } catch (error) {
    next(error);
  }
};

export const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    res.status(200).json({ success: true, data: opportunity });
  } catch (error) {
    next(error);
  }
};

export const createOpportunity = async (req, res, next) => {
  try {
    const validation = validateOpportunityPayload(req.body);

    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const opportunity = await Opportunity.create(req.body);
    res.status(201).json({ success: true, message: 'Opportunity created successfully', data: opportunity });
  } catch (error) {
    next(error);
  }
};

export const updateOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    res.status(200).json({ success: true, message: 'Opportunity updated successfully', data: opportunity });
  } catch (error) {
    next(error);
  }
};

export const deleteOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findByIdAndDelete(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    res.status(200).json({ success: true, message: 'Opportunity deleted successfully', data: opportunity });
  } catch (error) {
    next(error);
  }
};
