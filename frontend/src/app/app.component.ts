import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'gas-GmailAutoPurge';  
  
  headerColumns = [
    {title: "Notes"},
    {title: "label"},
    {title: "Retention period"},
    {title: "Leave starred email"},
    {title: "Leave important email"}
  ]
  
  tableRows = [];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    google.script.run.withSuccessHandler(this.bindData.bind(this)).getSettings();
  }
  
  bindData(resultData) {
    this.tableRows = resultData;
    this.cd.detectChanges();
  }
}
