const hbs = require('hbs');

hbs.registerHelper('obtenerPromedio', (nota1,nota2,nota3) =>{
    return (nota1+nota2+nota3)/3
});

hbs.registerHelper('listarCursos',() =>{
    listaCursos = require('./listadoCursos.json')
    let texto= '<b>Lista de cursos disponibles:</b><br><br>'+
    "<table> \
        <thead> \
            <th> Id Curso </th>\
            <th> Nombre </th>\
            <th> Descripción </th>\
            <th> Valor </th>\
            <th> Modalidad </th>\
            <th> Intensidad </th>\
        </thead>\
        <tbody>";
        
    listaCursos.forEach(curso => {
        modalidad = curso.modalidad == 1 ? 'Virtual' : 'Presencial';
        texto +=
        '<tr>' +
           '<td>' + curso.idCurso + '</td> ' + 
           '<td>' + curso.nombre + '</td> ' + 
           '<td>' + curso.descripcion + '</td> ' + 
           '<td>$' + curso.valor + '</td> ' + 
           '<td>' + modalidad + '</td> ' + 
           '<td>' + curso.intensidadHoraria + ' hrs</td> ' +
           '<td><a href="/inscribirCurso?idCurso='+curso.idCurso+'&nombre='+curso.nombre+'"> Ver/Inscribir </a></td> ' +
        '</tr>';
    });
    texto += '</tbody></table>';
    return texto;
})

hbs.registerHelper('listarUsuarios',() =>{
    listaUsuarios = require('./listadoUsuarios.json')
    let texto= 
    "<table> \
        <thead> \
            <th> Id Usuario </th>\
            <th> Nombre </th>\
            <th> Correo </th>\
            <th> Teléfono </th>\
            <th> Rol </th>\
            <th>  </th>\
        </thead>\
        <tbody>";
        
    listaUsuarios.forEach(item => {
        texto +=
        '<tr>' +
           '<td>' + item.idUsuario + '</td> ' + 
           '<td>' + item.nombre + '</td> ' + 
           '<td>' + item.correo + '</td> ' + 
           '<td>' + item.telefono + '</td> ' + 
           '<td>' + item.rol + '</td> ' +
           '<td><a href="/editarUsuario?idUsuario='+item.idUsuario+'&nombre='+item.nombre+'"> Editar </a></td> ' +
        '</tr>';
    });
    texto += '</tbody></table>';
    return texto;
})

const cargarListadoCursos = () => {
    try{
        listadoCursos = require('./listadoCursos.json');
    } catch(error){
        listadoCursos = [];
    }
    //listaEstudiantes = JSON.parse(fs.readFielSync())
}

const cargarListadoUsuarios = () => {
    try{
        listadoUsuarios = require('./listadoUsuarios.json');
    } catch(error){
        listadoUsuarios = [];
    }
}

hbs.registerHelper('listarCurso',(idCurso) =>{
    let texto=
    "<table> \
        <thead> \
            <th> Descripción </th>\
            <th> Valor </th>\
            <th> Modalidad </th>\
            <th> Intensidad </th>\
        </thead>\
        <tbody>";
        
    cargarListadoCursos();
    let curso = listadoCursos.find(buscar => buscar.idCurso ==idCurso)
     
    if(!curso) {
            texto='<b> Curso Inexistente</b>'
        }
        else{
            modalidad = curso.modalidad == 1 ? 'Virtual' : 'Presencial';
            texto +=
            '<tr>' +
            '<td>' + curso.descripcion + '</td> ' + 
            '<td>$' + curso.valor + '</td> ' + 
            '<td>' + modalidad + '</td> ' + 
            '<td>' + curso.intensidadHoraria + ' horas</td>\
            </tr>';
    };
    texto += '</tbody></table>';
    return texto;
})

hbs.registerHelper('editarUsuario',(idUsuario) =>{    
    cargarListadoUsuarios();
    let usuario = listadoUsuarios.find(buscar => buscar.idUsuario ==idUsuario);
    if(!usuario) {
        texto='<b> Usuario Inexistente</b>'
    }
    else{
        texto=
        '<b>Id Usuario:</b> <input type="text" id="idUsuario" name="idUsuario" value="'+usuario.idUsuario+'"><br><br>' +
        '<b> Nombre &nbsp&nbsp :</b> <input type="text" id="nombre" name="nombre" value="'+usuario.nombre+'"><br><br>' +
        '<b> Correo &nbsp&nbsp&nbsp&nbsp :</b> <input type="text" id="correo" name="correo" value="'+usuario.correo+'"><br><br>' +
        '<b> Teléfono &nbsp&nbsp:</b> <input type="text" id="telefono" name="telefono" value="'+usuario.telefono+'"><br><br>' +
        //'<b> Rol &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp :</b> <input type="text" id="rol" name="rol" value="'+usuario.rol+'">';
        '<b> Rol &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp :</b>\
        <select name="rol">';
        if(usuario.rol=='Aspirante') texto += '<option value="Aspirante" selected>Aspirante</option> <option value="Docente" >Docente</option>';
        else texto += '<option value="Docente" selected>Docente</option> <option value="Aspirante" >Aspirante</option>';
        texto += '</select>';
    };
    return texto;
})


module.exports = {cargarListadoUsuarios}