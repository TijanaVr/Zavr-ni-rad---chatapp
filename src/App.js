import React, { Component } from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input";

function randomName() {
  const adjectives = [
    "Manuela", "Andrea", "Jasna", "Ana", "Iva", "Lara", "Karmela", "Marijana",
    "Petra", "Antonia", "Nevenka", "Ljubica", "Irina", "Nikolina", "Damir", "Petar",
    "Tomislav", "Mario", "Matija", "Alan", "Edvin", "Ivana", "Maja", "Sara", "Katarina", 
    "Mateja", "Ivona", "Luna", "Luka", "Dario", "Igor", "Mirko", "Hrvoje", "Zoran", 
    "Niko", "Adrian", "Dorian", 
  ];
  const nouns = [
    "Horvat", "Anić", "Kovačić", "Babić", "Marić", "Novak", "Jurić", "Kovač",
    "Vuković", "Knežević", "Marković", "Božić", "Grgić", "Filipović", "Jukić", "Vidović",
    "Lukić", "Bašić", "Matić", "Kralj", "Varga", "Cindrić", "Galić", "Marić",
    "Mikulić", "Radić", "Lučić", "Pavlić", "Stanić", "Tadić", "Kolar", "Pejić",
    "Erceg", "Valentić", "Jelić"
  ];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return adjective + noun;
}

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomName(),
      color: randomColor(),
    }
  }

  constructor() {
    super();
    this.drone = new window.Scaledrone("Agz0Z4E3EZpXGvG3", {
      data: this.state.member
    });
    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.drone.clientId;
      this.setState({member});
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Chat aplikacija</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input
          onSendMessage={this.onSendMessage}
        />
      </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message
    });
  }

}

export default App;