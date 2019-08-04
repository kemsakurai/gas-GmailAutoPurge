import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ConfigRow } from '../configRow';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  configRow: ConfigRow;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private cd: ChangeDetectorRef
  ) { 
      this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      // snapshotを参照する
      if (!id) {
           // idがなかった場合の処理
          console.log('id is none');
      } else {
          google.script.run.withSuccessHandler(this.bindData.bind(this)).getConfig(id);
      }        
    });
  }

  ngOnInit() {}

  bindData(result) {
    let row : ConfigRow = new ConfigRow();
    row.notes = result['Notes'];
    row.label = result['label'];
    row.retentionPeriod = result['Retention period'];
    row.leaveStarredEmail = result['Leave starred email'];
    row.leaveImportantEmail = result['Leave important email'];
    this.configRow = row;
    this.cd.detectChanges();
  }

  goBack(): void {
    this.location.back();
  }
}
