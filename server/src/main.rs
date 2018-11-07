// Copyright 2018 TAP, Inc. All Rights Reserved.

extern crate ws;
extern crate lazy_static;

use std::sync::Mutex;

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
    SENDERS.lock().unwrap().push(sender.clone());
    EchoHandler{
      me: sender,
    }
  }

  fn connection_lost(&mut self, handler: EchoHandler) {
    SENDERS.lock().unwrap().retain(|ref sender| {
      handler.me.ne(sender)
    });
  }

  fn on_shutdown(&mut self) {
    SENDERS.lock().unwrap().clear();
  }
}

fn main() {
  ws::WebSocket::new(Server {}).unwrap().listen("localhost:8989").unwrap();
}
