import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { Observable } from "rxjs/Observable";
import * as firebase from 'firebase/app';

interface Message {
  message: string,
  isSent: boolean
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  phoneNumbers: FirebaseListObservable<string[]>;
  pendingMessages: FirebaseListObservable<Message[]>;
  user: Observable<firebase.User>;
  newPhone: string;
  newPendingMessage: string;

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.phoneNumbers = this.db.list('/phoneNumbers');
    this.pendingMessages = this.db.list('/messages');
    this.user = this.afAuth.authState;
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  addPhoneNumber(phoneNumber: string) {
    this.phoneNumbers.push(phoneNumber);
  }

  addPendingMessage(message: string) {
    this.pendingMessages.push({
      message,
      isSent: false
    });
  }

}
