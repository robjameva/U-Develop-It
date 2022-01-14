const express = require('express')
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get all candidates
router.get('/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name AS party_name 
                 FROM candidates 
                 LEFT JOIN parties 
                 ON candidates.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// SELECT individual 
router.get('/candidates/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name AS party_name 
                 FROM candidates 
                 LEFT JOIN parties 
                 ON candidates.party_id = parties.id 
                 WHERE candidates.id = ?`;

    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({
            message: 'success',
            data: row
        });
    });
});


// DELETE query
router.delete('/candidates/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});


// CREATE query
router.post('/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) return res.status(400).json({ error: errors });

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({
            message: 'success',
            data: body
        });
    });
});

// Update Candidate Party
router.put('/candidates/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');
    if (errors) return res.status(400).json({ error: errors });

    const sql = `UPDATE candidates 
                 SET party_id = ?
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

module.exports = router;