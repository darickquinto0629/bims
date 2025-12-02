const { sequelize, Household, Resident, Official, Certificate, Blotter, User } = require('../models');
const bcrypt = require('bcrypt');

async function seed() {
  await sequelize.sync({ force: true });
  console.log('DB synced (force:true)');

  const h1 = await Household.create({ household_code: 'BRGY-001', address_line: '123 A St', barangay: 'Poblacion', city_municipality: 'Sample City', province: 'Sample Province' });
  const h2 = await Household.create({ household_code: 'BRGY-002', address_line: '45 B St', barangay: 'Central', city_municipality: 'Sample City', province: 'Sample Province' });

  const r1 = await Resident.create({ household_id: h1.id, first_name: 'Juan', last_name: 'Dela Cruz', birth_date: '1990-01-01', gender: 'Male', contact_number: '09171234567' });
  const r2 = await Resident.create({ household_id: h2.id, first_name: 'Maria', last_name: 'Santos', birth_date: '1985-03-15', gender: 'Female', contact_number: '09179876543' });

  await Official.create({ name: 'Hon. Pedro Mayor', position: 'Barangay Captain', term_start: '2022-01-01', term_end: '2028-12-31', contact: '09170000001' });

  await Certificate.create({ resident_id: r1.id, type: 'Barangay Clearance', issued_by: 'Hon. Pedro Mayor' });
  await Blotter.create({ resident_id: r2.id, incident_date: '2024-08-10', description: 'Minor dispute', reported_by: 'Neighbor' });

  const pass = await bcrypt.hash('admin123', 10);
  await User.create({ username: 'admin', password_hash: pass, role: 'admin', full_name: 'Administrator' });

  console.log('Seeding complete');

    // Create staff user
    const staffPass = await bcrypt.hash('staff123', 10);
    await User.create({ username: 'staff', password_hash: staffPass, role: 'staff', full_name: 'Staff Member' });

  process.exit(0);
}

seed();
