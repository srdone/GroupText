import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { Observable } from "rxjs/Observable";
import * as firebase from 'firebase/app';

interface Message {
  message: string,
  isSent: boolean
}

interface Recipient {
  phoneNumber: string,
  name: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  recipients: FirebaseListObservable<Recipient[]>;
  pendingMessages: FirebaseListObservable<Message[]>;
  user: Observable<firebase.User>;
  newRecipient: Recipient = {name: undefined, phoneNumber: undefined};
  newPendingMessage: string;

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.recipients = this.db.list('/recipients');
    this.pendingMessages = this.db.list('/messages');
    this.user = this.afAuth.authState;
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  addPhoneNumber(newRecipient) {
    this.recipients.push(newRecipient);
  }

  addPendingMessage(message: string) {
    this.pendingMessages.push({
      message,
      isSent: false
    });
  }

}
