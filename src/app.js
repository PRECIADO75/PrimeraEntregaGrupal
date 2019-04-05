const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./helpers');
const fs = require('fs');
const directorioPublico = path.join(__dirname,'../public');
const directorioPartials= path.join(__dirname,'../partials');
const helpers = require('./helpers');
const port=process.env.port||3000;
app.use(express.static(directorioPublico));
hbs.registerPartials(directorioPartials);
app.use(bodyParser.urlencoded({extended:false}))
app.set ('view engine','hbs');

app.get('/',(req,res)=>{
    res.render('index',{
        estudiante:'Ever'
    });
});

const cargarListadoInscritos = () => {
    try{
        listadoInscritos = require('./listadoInscritos.json');
    } catch(error){
        listadoInscritos = [];
    }
}

const crearInscripcionACurso = (idUsuario, idCurso) => {
    cargarListadoInscritos();
    let insc = {
        idUsuario:idUsuario,
        idCurso: idCurso
    };
    let duplicado = listadoInscritos.find(m => m.idUsuario == idUsuario && m.idCurso == idCurso)
    if(!duplicado){
        listadoInscritos.push(insc);
        guardarListadoInscritos();
        return 'Inscripción Exitosa.';
    }
    else{
        return 'Error: El estudiante ya se encuentra inscrito en este curso';
    }
}

guardarListadoInscritos = () =>{
    let datos = JSON.stringify(listadoInscritos);
    fs.writeFile('./src/listadoInscritos.json',datos,(err)=>{
        if(err) throw (err);
    })
};

app.get('/inscribirCurso',(req,res) => {
    if(!req.query.confirmar){//mostrar inicialmente la pagina de confirmacion de inscripcion
        res.render('inscribirCurso',{
            idCurso:parseInt(req.query.idCurso),//req.body.idCurso), //se cambia req.query por req.body al hacerlo con el post en vez del get
            nombreCurso:req.query.nombre,
            idUsuario: 1234
        });
    }
    else{//al presionar el boton confirmar, guardar la inscripcion y mostrar mensaje
        let resultado = crearInscripcionACurso(req.query.idUsuario,req.query.idCurso);
        res.render('inscribirCurso',{
            confirmar: true,
            mensaje: resultado
        });
    }
})

app.get('/listarUsuarios',(req,res) => {
        res.render('listarUsuarios',{});
    });

    app.get('/editarUsuario',(req,res) => {
        res.render('editarUsuario',{
            nombre:req.query.nombre,
            idUsuario: req.query.idUsuario
        });
    });

app.post('/confirmEditarUsuario',(req,res) => {
    helpers.cargarListadoUsuarios();
    let usuario = listadoUsuarios.find(buscar => buscar.idUsuario ==req.body.idUsuario);
    console.log(usuario);
    if(!usuario) {
        texto='<b> Usuario Inexistente</b>'
    }
    else{
        usuario.idUsuario = req.body.idUsuario;
        usuario.nombre = req.body.nombre;
        usuario.correo = req.body.correo;
        usuario.telefono = req.body.telefono;
        usuario.rol = req.body.rol;  
        guardarListadoUsuarios();
    };
    res.render('confirmEditarUsuario',{
        //estudiante: req.body.nombre,
        mensaje:'Datos de Usuario Actualizados!'
    });
})

const guardarListadoUsuarios = () => {
    let datos = JSON.stringify(listadoUsuarios);
    fs.writeFile('./src/listadoUsuarios.json',datos,(err)=>{
        if (err) throw (err);
        console.log('Archvio creado con éxito');
    })
};

app.get('*',(req,res) =>{
    res.render('error',{
        estudiante: 'error'
    })
})

app.listen(port,() =>{
    console.log('Escuchando en el puerto '+port)
});

