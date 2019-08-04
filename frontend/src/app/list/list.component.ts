import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { ConfigRow } from '../configRow';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

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
    google.script.run.withSuccessHandler(this.bindData.bind(this)).getConfigs();
  }

  bindData(resultData) {
    let tableRows = new Array();
    for (let item of resultData) {
      let configRow : ConfigRow = new ConfigRow();
      configRow.notes = item['Notes'];
      configRow.label = item['label'];
      configRow.retentionPeriod = item['Retention period'];
      configRow.leaveStarredEmail = item['Leave starred email'];
      configRow.leaveImportantEmail = item['Leave important email'];
      tableRows.push(configRow);
    }
    this.tableRows = tableRows;
    this.cd.detectChanges();
  }
}
