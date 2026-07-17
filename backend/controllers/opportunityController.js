import Opportunity from '../models/Opportunity.js';

const normalizeText = (value = '') => value.toString().trim().toLowerCase();

const validateOpportunityPayload = (payload) => {
  const requiredFields = ['title', 'company', 'category', 'description', 'eligibility', 'location', 'deadline', 'package'];
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
    const {
      category,
      status,
      location,
      search = '',
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};

    if (category) query.category = new RegExp(`^${normalizeText(category)}$`, 'i');
    if (status) query.status = new RegExp(`^${normalizeText(status)}$`, 'i');
    if (location) query.location = new RegExp(normalizeText(location), 'i');

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') }
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
      pages: Math.ceil(total / pageSize),
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

    const opportunities = await Opportunity.find({
      $or: [
        { title: new RegExp(searchTerm, 'i') },
        { company: new RegExp(searchTerm, 'i') },
        { description: new RegExp(searchTerm, 'i') },
        { category: new RegExp(searchTerm, 'i') }
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
    res.status(201).json({ success: true, data: opportunity });
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

    res.status(200).json({ success: true, data: opportunity });
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
