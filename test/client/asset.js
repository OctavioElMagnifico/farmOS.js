const chai = require('chai');
const { v4: uuidv4 } = require('uuid');
const { reportError } = require('../report');
const { farm, session } = require('./client');

const { expect } = chai;

describe('asset', function () {
  this.timeout(10000);
  it('creates an asset with client-generated id, revises, fetches and deletes it.', () => {
    const id = uuidv4();
    return session()
      .then(() => {
        const asset = {
          id,
          type: 'asset--equipment',
          attributes: {
            name: 'Node Test Equipment',
          },
        };
        return farm.asset.send('equipment', asset);
      })
      .then((response) => {
        expect(response).to.have.nested.property('data.data.id', id);
        const asset = {
          id,
          type: 'asset--equipment',
          attributes: {
            name: 'Node Test Equipment Revised',
            status: 'archived',
          },
        };
        return farm.asset.send('equipment', asset);
      })
      .then(() => {
        const filter = { status: 'archived' };
        return farm.asset.fetch('equipment', { filter });
      })
      .then((response) => {
        const asset = response.data.data.find(l => l.id === id);
        expect(asset).to.have.nested.property('attributes.name', 'Node Test Equipment Revised');
        return farm.asset.delete('equipment', id);
      })
      .then(() => farm.asset.fetch('equipment', { filter: { id } }))
      .then((response) => {
        expect(response.data.data).to.have.lengthOf(0);
      })
      .catch(reportError);
  });
});
