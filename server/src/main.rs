// Copyright 2018-2019 TAP, Inc. All Rights Reserved.

extern crate ws;
extern crate lazy_static;

use std::sync::Mutex;
use std::env;

lazy_static::lazy_static! {
  static ref SENDERS: Mutex<Vec<ws::Sender>> = Mutex::new(Vec::new());
}

struct EchoHandler {
  me: ws::Sender,
}

impl ws::Handler for EchoHandler {
  fn on_message(&mut self, msg: ws::Message) -> ws::Result<()> {
    for ref i in SENDERS.lock().unwrap().iter() {
      if self.me.ne(i) {
        i.send(msg.clone()).unwrap();
      }
    }

    Ok(())
  }
}

struct Server {}

impl ws::Factory for Server {
  type Handler = EchoHandler;

  fn connection_made(&mut self, sender: ws::Sender) -> EchoHandler {
    println!("Connection : {}", sender.connection_id());

    sender.send(format!("Connect:{}", sender.connection_id())).unwrap();

    SENDERS.lock().unwrap().push(sender.clone());
    EchoHandler{
      me: sender,
    }
  }

  fn connection_lost(&mut self, handler: EchoHandler) {
    println!("Disconnect : {}", handler.me.connection_id());

    SENDERS.lock().unwrap().retain(|ref sender| {
      sender.send(format!("Disconnect:{}", handler.me.connection_id())).unwrap();

      handler.me.ne(sender)
    });
  }

  fn on_shutdown(&mut self) {
    SENDERS.lock().unwrap().clear();
  }
}

fn main() {
  if let Some(arg1) = env::args().nth(1) {
    println!("Open : {}", arg1);
    ws::WebSocket::new(Server {}).unwrap().listen(arg1).unwrap();
  }
  else {
    println!("Open : localhost:8989");
    ws::WebSocket::new(Server {}).unwrap().listen("localhost:8989").unwrap();
  }
}
