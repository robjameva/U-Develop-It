const express = require('express')
const router = express.Router();
const db = require('../../db/connection');

// Parties Section
router.get('/parties', (req, res) => {
    const sql = `SELECT *
                 FROM parties`;

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
            message: 'success',
            data: rows
        });
    });
});

router.get('/parties/:id', (req, res) => {
    const sql = `SELECT *
                 FROM parties
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

// DELETE query
router.delete('/parties/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
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