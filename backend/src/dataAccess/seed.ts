import { Gender } from './models';

const seedPostgreSql = async () => {
  // Seed genders

  const response = await Gender.findAndCountAll();
  if (response.count > 0) return;
  await Gender.create({
    id: 1,
    label: 'MALE',
  });
  await Gender.create({
    id: 2,
    label: 'FEMALE',
  });
};

export { seedPostgreSql };
