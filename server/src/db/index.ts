import { Sequelize } from 'sequelize';

if (process.env.NODE_ENV === 'production') {
  var sequelize = new Sequelize(process.env.DATABASE_URL!);
} else {
  var sequelize = new Sequelize('myapp1', 'postgres', '1245', {
    host: 'postgres',
    dialect: 'postgres',
    pool: {
      max: 100,
      min: 0,
      idle: 200000,
      // @note https://github.com/sequelize/sequelize/issues/8133#issuecomment-359993057
      acquire: 1000000,
      evict: 10000
    },

    logging: false,
    define: {
      underscored: true
    }
  });
}

export default sequelize;
