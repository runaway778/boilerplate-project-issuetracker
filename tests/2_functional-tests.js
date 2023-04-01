const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

    let _id;

    test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .post('/api/issues/apitest')
            .send({
                issue_title: 'Fix error in posting data',
                issue_text: 'When we post data it has an error.',
                created_by: 'Joe',
                assigned_to: 'Joe',
                status_text: 'In QA'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.issue_title, 'Fix error in posting data');
                assert.equal(res.body.issue_text, 'When we post data it has an error.');
                assert.equal(res.body.created_by, 'Joe');
                assert.equal(res.body.assigned_to, 'Joe');
                assert.equal(res.body.status_text, 'In QA');

                done();
            });
    });

    test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .post('/api/issues/apitest')
            .send({
                issue_title: 'Fix error in posting data',
                issue_text: 'When we post data it has an error.',
                created_by: 'Joe'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.issue_title, 'Fix error in posting data');
                assert.equal(res.body.issue_text, 'When we post data it has an error.');
                assert.equal(res.body.created_by, 'Joe');

                done();
            });
    });

    test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .post('/api/issues/apitest')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'required field(s) missing');

                done();
            });
    });

    test('View issues on a project: GET request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .get('/api/issues/apitest')
            .end((err, res) => {
                _id = res.body[0]._id;
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                // TODO actual testing

                done();
            });
    });

    test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .get('/api/issues/apitest')
            .query({
                _id
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                // TODO actual testing

                done();
            });
    });

    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .get('/api/issues/apitest')
            .query({
                _id,
                open: true
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                // TODO actual testing

                done();
            });
    });

    test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
                _id,
                status_text: 'In Progress'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, _id);

                done();
            });
    });

    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
                _id,
                issue_title: 'DONE: Fix error in posting data',
                issue_text: 'DONE: When we post data it has an error.',
                status_text: 'Done'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, _id);

                done();
            });
    });

    test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .put('/api/issues/apitest')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'missing _id');

                done();
            });
    });

    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
                _id
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'no update field(s) sent');
                assert.equal(res.body._id, _id);

                done();
            });
    });

    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
                _id: -1,
                issue_title: 'RETURNED: Fix error in posting data',
                issue_text: 'RETURNED: When we post data it has an error.',
                status_text: 'Returned'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'could not update');
                assert.equal(res.body._id, -1);

                done();
            });
    });

    test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .delete('/api/issues/apitest')
            .send({
                _id
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.result, 'successfully deleted');
                assert.equal(res.body._id, _id);

                done();
            });
    });

    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .delete('/api/issues/apitest')
            .send({
                _id: -1
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'could not delete');
                assert.equal(res.body._id, -1);

                done();
            });
    });

    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .delete('/api/issues/apitest')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'missing _id');

                done();
            });
    });

});
