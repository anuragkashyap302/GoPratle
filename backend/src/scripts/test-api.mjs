/**
 * Automated Verification Script for GoPratle Backend
 * Runs comprehensive tests against the REST API
 */

const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

async function testApi() {
  console.log(`\n Starting GoPratle API Verification Suite against ${BASE_URL}\n`);
  let passed = 0;
  let failed = 0;

  async function runTest(testName, fn) {
    try {
      process.stdout.write(`• ${testName} ... `);
      await fn();
      console.log('PASS');
      passed++;
    } catch (err) {
      console.log('FAIL');
      console.error('  Error:', err.message);
      failed++;
    }
  }

  // 1. Health check
  await runTest('GET /api/health should return 200 and DB connected', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok' || !data.database?.connected) {
      throw new Error(`Unexpected body: ${JSON.stringify(data)}`);
    }
  });

  let createdPlannerId = null;

  // 2. Create Planner Requirement
  await runTest('POST /api/requirements (Planner) should create document', async () => {
    const payload = {
      eventName: 'Grand Heritage Palace Wedding',
      eventType: 'wedding',
      isMultiDay: true,
      startDate: new Date(Date.now() + 86400000 * 30).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 32).toISOString(),
      location: 'Udaipur, Rajasthan',
      venue: 'The Leela Palace Lake Pichola',
      category: 'planner',
      categoryDetails: {
        guestCount: '300 - 800',
        servicesNeeded: ['full_planning', 'vendor_management', 'decor_styling'],
        themeOrVision: 'Royal Rajasthani vintage aesthetic with marigold and warm lighting'
      },
      additionalDetails: {
        budget: 1500000,
        cateringCoordination: true,
        additionalNotes: 'Need airport transfers and royal welcome squad coordination'
      }
    };

    const res = await fetch(`${BASE_URL}/requirements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.status !== 201) {
      const err = await res.text();
      throw new Error(`Expected 201, got ${res.status}: ${err}`);
    }

    const json = await res.json();
    if (!json.success || !json.data?._id || json.data.category !== 'planner') {
      throw new Error(`Invalid response structure: ${JSON.stringify(json)}`);
    }
    createdPlannerId = json.data._id;
  });

  // 3. Create Performer Requirement
  await runTest('POST /api/requirements (Performer) should create document', async () => {
    const payload = {
      eventName: 'Sunburn Campus Sunset Festival',
      eventType: 'concert',
      isMultiDay: false,
      startDate: new Date(Date.now() + 86400000 * 15).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 15).toISOString(),
      location: 'Goa',
      venue: 'Vagator Beach Arena',
      category: 'performer',
      categoryDetails: {
        performanceType: 'dj',
        genreOrStyle: 'Melodic Techno & Progressive House',
        durationMinutes: 120,
        performerCount: 2
      },
      additionalDetails: {
        budget: 85000,
        soundSystemProvided: true,
        technicalRider: 'Pioneer CDJ-3000 x 3, DJM-900NXS2 mixer, 2 x 15-inch active monitors',
        hospitalityNotes: 'Airport pickup and green room refreshments'
      }
    };

    const res = await fetch(`${BASE_URL}/requirements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.status !== 201) {
      const err = await res.text();
      throw new Error(`Expected 201, got ${res.status}: ${err}`);
    }

    const json = await res.json();
    if (json.data.category !== 'performer') {
      throw new Error(`Expected category performer, got ${json.data.category}`);
    }
  });

  // 4. Create Crew Requirement
  await runTest('POST /api/requirements (Crew) should create document', async () => {
    const payload = {
      eventName: 'Tech Visionary Summit 2027',
      eventType: 'corporate',
      isMultiDay: true,
      startDate: new Date(Date.now() + 86400000 * 10).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 11).toISOString(),
      location: 'Bengaluru, Karnataka',
      venue: 'BIEC Convention Center Hall 3',
      category: 'crew',
      categoryDetails: {
        crewRoles: [
          { role: 'Sound Engineer', count: 2 },
          { role: 'Live Stream Videographer', count: 3 },
          { role: 'Lighting Tech', count: 1 }
        ],
        experienceLevel: 'experienced',
        equipmentHandling: 'venue_provides_gear'
      },
      additionalDetails: {
        budgetType: 'flat_daily_rate',
        budgetAmount: 45000,
        shiftStartTime: '08:30',
        shiftDurationHours: 10,
        specialInstructions: 'Formal black crew attire. Briefing starts promptly at 08:30.'
      }
    };

    const res = await fetch(`${BASE_URL}/requirements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.status !== 201) {
      const err = await res.text();
      throw new Error(`Expected 201, got ${res.status}: ${err}`);
    }
  });

  // 5. Validation Check: Invalid Date (endDate < startDate)
  await runTest('Validation: should reject endDate < startDate with 400', async () => {
    const payload = {
      eventName: 'Invalid Date Festival',
      eventType: 'concert',
      isMultiDay: true,
      startDate: new Date(Date.now() + 86400000 * 20).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 10).toISOString(), // earlier!
      location: 'Mumbai',
      category: 'planner',
      categoryDetails: {
        guestCount: '< 100',
        servicesNeeded: ['full_planning']
      },
      additionalDetails: {
        budget: 50000,
        cateringCoordination: false
      }
    };

    const res = await fetch(`${BASE_URL}/requirements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.status !== 400) {
      throw new Error(`Expected 400 Bad Request, got ${res.status}`);
    }

    const json = await res.json();
    if (!json.errors || !json.errors.some((e) => e.field === 'endDate')) {
      throw new Error(`Expected field error for endDate, got: ${JSON.stringify(json)}`);
    }
  });

  // 6. Validation Check: Invalid Category
  await runTest('Validation: should reject invalid category with 400', async () => {
    const payload = {
      eventName: 'Invalid Category Event',
      eventType: 'corporate',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      location: 'Delhi',
      category: 'astronaut', // invalid!
      categoryDetails: {},
      additionalDetails: {}
    };

    const res = await fetch(`${BASE_URL}/requirements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.status !== 400) {
      throw new Error(`Expected 400 Bad Request, got ${res.status}`);
    }
  });

  // 7. Get Requirements List & Filters
  await runTest('GET /api/requirements with category filter', async () => {
    const res = await fetch(`${BASE_URL}/requirements?category=planner`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    if (!Array.isArray(json.data) || json.data.length === 0) {
      throw new Error(`Expected non-empty planner array`);
    }
    if (json.data[0].category !== 'planner') {
      throw new Error(`Returned item has category: ${json.data[0].category}`);
    }
  });

  // 8. Get Requirement by ID
  if (createdPlannerId) {
    await runTest('GET /api/requirements/:id should return created document', async () => {
      const res = await fetch(`${BASE_URL}/requirements/${createdPlannerId}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (json.data._id !== createdPlannerId) {
        throw new Error(`Expected ID ${createdPlannerId}, got ${json.data._id}`);
      }
    });
  }

  // 9. Stats endpoint
  await runTest('GET /api/requirements/stats should return aggregated counts', async () => {
    const res = await fetch(`${BASE_URL}/requirements/stats`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    if (typeof json.data.total !== 'number' || json.data.total < 3) {
      throw new Error(`Expected stats with >= 3 items, got: ${JSON.stringify(json)}`);
    }
  });

  console.log(`\n📊 Verification Summary: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) process.exit(1);
}

testApi().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
