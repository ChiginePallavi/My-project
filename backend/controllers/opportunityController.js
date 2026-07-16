import { opportunities } from '../data/opportunities.js';

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

export const getAllOpportunities = (req, res) => {
  const { category, status, location, sort = 'title', order = 'asc' } = req.query;
  let result = [...opportunities];

  if (category) {
    result = result.filter((item) => normalizeText(item.category) === normalizeText(category));
  }

  if (status) {
    result = result.filter((item) => normalizeText(item.status) === normalizeText(status));
  }

  if (location) {
    result = result.filter((item) => normalizeText(item.location).includes(normalizeText(location)));
  }

  result.sort((a, b) => {
    const first = normalizeText(a[sort] || '');
    const second = normalizeText(b[sort] || '');
    if (first < second) return order === 'desc' ? 1 : -1;
    if (first > second) return order === 'desc' ? -1 : 1;
    return 0;
  });

  res.status(200).json(result);
};

export const searchOpportunities = (req, res) => {
  const { name = '' } = req.query;
  const searchTerm = normalizeText(name);

  if (!searchTerm) {
    return res.status(200).json(opportunities);
  }

  const filtered = opportunities.filter((item) => {
    const haystack = `${item.title} ${item.company} ${item.description} ${item.category}`.toLowerCase();
    return haystack.includes(searchTerm);
  });

  res.status(200).json(filtered);
};

export const getOpportunityById = (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'Invalid opportunity ID' });
  }

  const opportunity = opportunities.find((item) => item.id === id);

  if (!opportunity) {
    return res.status(404).json({ message: 'Opportunity not found' });
  }

  res.status(200).json(opportunity);
};

export const createOpportunity = (req, res) => {
  const validation = validateOpportunityPayload(req.body);

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const newOpportunity = {
    id: opportunities.length ? Math.max(...opportunities.map((item) => item.id)) + 1 : 1,
    ...req.body
  };

  opportunities.push(newOpportunity);
  res.status(201).json(newOpportunity);
};

export const updateOpportunity = (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'Invalid opportunity ID' });
  }

  const index = opportunities.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Opportunity not found' });
  }

  const updatedOpportunity = {
    ...opportunities[index],
    ...req.body,
    id: opportunities[index].id
  };

  opportunities[index] = updatedOpportunity;
  res.status(200).json(updatedOpportunity);
};

export const deleteOpportunity = (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'Invalid opportunity ID' });
  }

  const index = opportunities.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Opportunity not found' });
  }

  const [removedOpportunity] = opportunities.splice(index, 1);
  res.status(200).json({ message: 'Opportunity deleted successfully', opportunity: removedOpportunity });
};
