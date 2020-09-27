import sequelize from 'src/config/db';

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  conn.close();
});
