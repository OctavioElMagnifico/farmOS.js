/* eslint-disable no-console */
const farmOS = require('../dist/cjs/farmOS').default;
const entities = require('../dist/cjs/entities');

const { default: defaultEntities, defaultOptions } = entities;

const profile = {
  nomenclature: {
    name: 'profile',
    shortName: 'profile',
    plural: 'profiles',
    shortPlural: 'profiles',
    display: 'Profile',
    displayPlural: 'Profiles',
  },
  defaultOptions,
};

const host = 'http://localhost';
const clientId = 'fieldkit';
const username = 'farm';
const password = 'farm';

const farmOptions = {
  remote: { host, clientId },
  entities: { ...defaultEntities, profile },
};

const farm = farmOS(farmOptions);
farm.remote.authorize(username, password)
  .then(() => farm.schema.fetch())
  .then((res) => {
    farm.schema.set(res);
    const commonSchemata = farm.schema.get('profile', 'common');
    console.log('common attributes:\n', Object.keys(commonSchemata.properties.attributes));
    const commonProfile = farm.profile.create({ type: 'common', name: 'Maggie\'s Farm' });
    console.log('commonProfile:\n', commonProfile);
  })
  .then(() => {

  })
  .catch((e) => {
    const data = e && e.response && e.response.data;
    console.error(data || e);
  });
