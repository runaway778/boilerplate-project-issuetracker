'use strict';

const { ObjectId } = require('mongodb');

module.exports = function (app, Issue) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
      let filter = {
        project: project
      };
      if (req.query) {
        filter = {
          project: project,
          ...req.query
        };
      }
      Issue
        .find(filter)
        .select('-project -__v')
        .then((doc) => {
          res.json(doc);
        })
        .catch((err) => {
          res.json(err);
        });
    })

    .post(function (req, res) {
      let project = req.params.project;
      if (!(req.body.issue_title && req.body.issue_text && req.body.created_by)) {
        return res.json({ error: 'required field(s) missing' });
      }
      const issue = new Issue({
        project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || ''
      });
      issue
        .save()
        .then((doc) => {
          doc.project = undefined;
          doc.__v = undefined;
          res.json(doc);
        })
        .catch((err) => {
          res.json(err);
        });
    })

    .put(function (req, res) {
      const obj = req.body;
      if (!obj._id) {
        return res.json({ error: 'missing _id' });
      }
      if (Object.keys(obj).length == 1) {
        return res.json({ error: 'no update field(s) sent', _id: obj._id });
      }
      for (const key in obj) {
        if (!obj[key]) {
          delete obj[key];
        }
      }
      obj['updated_on'] = Date.now();
      Issue.findByIdAndUpdate(new ObjectId(req.body._id), obj, (err, doc) => {
        if (!doc || err) {
          res.json({ error: 'could not update', _id: obj._id });
        } else {
          res.json({ result: 'successfully updated', _id: obj._id });
        }
      });
    })

    .delete(function (req, res) {
      if (!req.body._id) {
        return res.json({ error: 'missing _id' });
      }
      Issue.findByIdAndDelete({ _id: req.body._id }, (err, doc) => {
        if (!doc || err) {
          res.json({ error: 'could not delete', _id: req.body._id });
        } else {
          res.json({ result: 'successfully deleted', _id: req.body._id });
        }
      });
    });

};
