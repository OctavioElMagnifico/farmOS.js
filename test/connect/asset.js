import chai from 'chai'; const { expect } = chai;
import { v4 as uuidv4 } from 'uuid';
import { farm, session } from './client.js';

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
      });
  });
});
