/*
 * @Author: Euan Millar 
 * @Date: 2017-07-05 01:14:45 
 * @Last Modified by: Euan Millar
 * @Last Modified time: 2017-07-05 12:12:53
 */
import bookshelf from '../bookshelf';

const Locations = bookshelf.Model.extend({
    tableName: 'locations'
});

const Documents = bookshelf.Model.extend({
    tableName: 'documents'
});

const Declaration = bookshelf.Model.extend({
    tableName: 'declarations',
    documents: function () {

        return this.hasMany(Documents, 'declaration_id');
    },
    locations: function () {

        return this.hasMany(Locations, 'declaration_id');
    },
    hasTimestamps: true
});

module.exports = bookshelf.model('Declaration', Declaration);
