import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  items: FirebaseListObservable<any[]>;

  constructor(public db: AngularFireDatabase) {}

  ngOnInit() {
    this.items = this.db.list('/items');
  }
}
