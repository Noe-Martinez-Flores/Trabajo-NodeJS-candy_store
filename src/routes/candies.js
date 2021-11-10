const express = require ('express');
const pool = require('../database');
const router = express.Router();

router.get ('/', async  (req,res)=> {
    let listCandies = await pool.query ('SELECT * FROM candies');
    res.json({
        status: 200,
        message: "Listado Completo",
        listCandies: listCandies
    })
});

router.get('/:id', async (req,res)=>{
    const {id} = req.params;
    let candies = await pool.query ('SELECT * FROM candies WHERE id = ?', [id]);
    res.json({
        status: 200,
        message: "Consulta especifica Exitosa",
        candies: candies
    });
});

router.post('/create', async (req,res) => {
    const {name,price,expiration,isSalad,date_created} = req.body;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    const candies = {
        name, price,expiration,isSalad,date_registered:dateTime,date_created,  status:1
    };

    await pool.query('INSERT INTO candies set ?', [candies]);
    res.json({
        status: 200,
        message: "Registro Exitoso",
        candies: candies
    });
});

router.post('/update/:id', (req,res) => {
    const {id} = req.params;
    const {name,price,expiration,isSalad} = req.body;

    const candies = {name, price,expiration,isSalad};
    pool.query('UPDATE candies SET ? WHERE id = ?', [candies, id]);
    res.json({
        status: 200,
        message: "Actualización Completada",
        candies: candies
    });
});

router.post('/delete/:id', (req,res)=>{
    const {id} = req.params;
    pool.query('UPDATE candies SET status = 0 WHERE id = ?',[id]);
    res.json({
        status: 200,
        message: "Estado Inactivo -> Completo"
    });
});
module.exports = router;
