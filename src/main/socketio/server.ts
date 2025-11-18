import { Server } from 'socket.io'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '../types'

export class SocketioServer {
  private server: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

  constructor() {
    this.server = new Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(20242, { cors: { origin: '*' } })
  }

  async enable(): Promise<void> {
    this.server.on('connection', (socket) => {
      console.log(`User ${socket.id} connected`)
      socket.on('sendDataToServer', (data) => {
        console.log(`User ${socket.id} sending data to scoreboard`)
        socket.broadcast.emit('newData', data)
      })
      socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected, goodby`)
      })
    })
  }
}
