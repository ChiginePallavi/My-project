export const getCompanyController = (req, res) => {
  res.json({ success: true, message: 'Company list ready' });
};

export const getCompanyByIdController = (req, res) => {
  const { id } = req.params;
  res.json({ success: true, message: `Company ${id} details fetched` });
};

export const createCompanyController = (req, res) => {
  res.status(201).json({ success: true, message: 'Company created' });
};

export const updateCompanyController = (req, res) => {
  const { id } = req.params;
  res.json({ success: true, message: `Company ${id} updated` });
};

export const deleteCompanyController = (req, res) => {
  const { id } = req.params;
  res.json({ success: true, message: `Company ${id} deleted` });
};
