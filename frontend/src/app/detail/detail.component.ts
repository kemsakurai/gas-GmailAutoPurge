import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ConfigRow } from '../configRow';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  configRow: ConfigRow;
  /** ここで子コンポーネントであるダイアログコンポーネントを取得しています */
  @ViewChild("dialog") dialogComponent: DialogComponent;
  parentData :string = "hello";

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

  save() {
    google.script.run.withSuccessHandler(this.onSaveComplete.bind(this)).saveConfig(this.configRow);
  }

  onSaveComplete() {
    this.dialogComponent.openDialog();
  }
  
  onCloseDialog() {
    this.location.back();
  }

}
