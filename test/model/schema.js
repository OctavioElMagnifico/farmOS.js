import chai from 'chai';
import model from '../../src/model/index.js';
import { loadSchema } from '../test-utils.js';

const { expect } = chai;
const activitySchema = loadSchema('log', 'activity');
const farm = model({ schemata: { log: { activity: activitySchema } } });

describe('schema', () => {
  describe('#get', () => {
    it('returns the available schemata', () => {
      const logTypes = Object.keys(farm.schema.get('log'));
      expect(logTypes).to.be.an('array').that.includes(
        'activity',
        'observation',
        'input',
        'harvest',
        'lab_test',
        'maintenance',
        'medical',
        'purchase',
        'sale',
        'seeding',
        'transplanting',
      );
    });
  });
  describe('#set', () => {
    it('adds another schema to logs', () => {
      farm.schema.set('log', 'foo', {});
      const logTypes = Object.keys(farm.schema.get('log'));
      expect(logTypes).to.be.an('array').that.includes(
        'activity',
        'observation',
        'input',
        'harvest',
        'lab_test',
        'maintenance',
        'medical',
        'purchase',
        'sale',
        'seeding',
        'transplanting',
        'foo',
      );
      const foo = farm.log.create({ type: 'foo', name: 'my foo log' });
      expect(foo.attributes.name).to.equal('my foo log');
      expect(foo.type).to.equal('foo');
    });
  });
});
