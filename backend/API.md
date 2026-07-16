# Placement Eligibility Predictor API

## Base URL
http://localhost:5000

## Endpoints

### GET /
Returns a welcome message and available API endpoints.

### GET /api/opportunities
Returns all opportunities.

### GET /api/opportunities/:id
Returns a single opportunity by ID.

### POST /api/opportunities
Creates a new opportunity.
Required fields: title, company, category, description, eligibility, location, deadline, package.

### PUT /api/opportunities/:id
Updates an opportunity by ID.

### DELETE /api/opportunities/:id
Deletes an opportunity by ID.

### GET /api/opportunities/search?name=value
Searches opportunities by matching title, company, description, or category.

### Query Parameters for GET /api/opportunities
- category
- status
- location
- sort
- order
