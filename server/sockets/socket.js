const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticketControl = new TicketControl();

io.on('connection', (client) => {

    client.on('siguienteTicket', (data, callback) => {

        let ticket = ticketControl.siguiente();

        console.log(ticket);
        callback(ticket);

    });

    // emitir un evento estadoActual

    client.emit('estadoActual', {
        actual: ticketControl.getUltimoticket(),
        ultimos4: ticketControl.getUltimos4()
    });

    client.on('atenderTicket', (data,callback) => {

        if( !data.escritorio ) {
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            });
        }

        let atenderTicket = ticketControl.atenderTicket( data.escritorio );

        callback(atenderTicket);

        //actualizar cambios en en los ultimos 4

        client.broadcast.emit('ultimos4', {
            ultimos4: ticketControl.getUltimos4()
        });
    });

});