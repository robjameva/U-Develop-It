const express = require('express')
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

router.get('/voters', (req, res) => {
    const sql = `SELECT *
                 FROM voters
                 ORDER BY last_name`;

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
            message: 'success',
            data: rows
        });
    });
});

router.get('/voters/:id', (req, res) => {
    const sql = `SELECT *
                 FROM voters
                 WHERE id = ?`;

    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({
            message: 'success',
            data: row
        });
    });
});

router.post('/voters', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');
    if (errors) return res.status(400).json({ error: errors });

    const sql = `INSERT INTO voters (first_name, last_name, email)
    VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.email];

    db.query(sql, params, (err, result) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({
            message: 'success',
            data: body
        });
    });
});

router.put('/voters/:id', (req, res) => {
    const errors = inputCheck(req.body, 'email');
    if (errors) return res.status(400).json({ error: errors });

    const sql = `UPDATE voters 
                 SET email = ?
                 WHERE id = ?`;
    const params = [req.body.email, req.params.id];

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

router.delete('/voters/:id', (req, res) => {
    const sql = `DELETE FROM voters WHERE id = ?`;
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


module.exports = router;