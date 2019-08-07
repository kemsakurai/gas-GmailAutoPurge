import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,  
  EventEmitter
} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  /** modal要素を取得 */
  @ViewChild("lgModal") modalRef :ModalDirective;
  /** 親からdialogDataを受け取る */
  @Input() dialogData;
  /** 親へのイベント通知用 */
  @Output() clickCloseButton = new EventEmitter<any>();

  /** modal内で扱うデータ */
  public data;

  ngOnInit() {
    // Do Nothing...
  }

  /** 親コンポーネントから呼び出される */
  openDialog() {
    /** ダイアログを開いた時、親データから値を取り直す */
    this.data = this.dialogData;
    this.modalRef.show();
  }
  
  /** モーダルの閉じるボタンを押した時に呼び出される */
  onClose() {
    this.modalRef.hide();
    /** 親コンポーネントへイベントを通知 */
    this.clickCloseButton.emit({data: this.dialogData});
  }
}