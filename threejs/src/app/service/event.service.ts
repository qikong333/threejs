import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  // public secondTabState: any;

  private data = new Subject<any>();
  private dataStream$ = this.data.asObservable();

  private subscriptions: Map<string, Array<any>> = new Map<string, Array<any>>();

  constructor() {
    this.dataStream$.subscribe((data) => this.onEvent(data));
  }
  /**
   * 全局的事件通知、订阅、回调服务。
   *   - 通知的内容可以是数字、字符串、json对象等，只要订阅者和发布者约定好格式即可。
   *   - 发布者和订阅者，通常是component (组件)，均需要在构造函数中注入
   *       ① import { GlobalState } from '../../app/global.state'; （路径视情况调整）
   *       ② constructor(public _state: GlobalState, ...){}
   *   - 发布例: 语言修改为英语
   *       this._state.notifyDataChanged('settings.lang.systemLang', 'en');
   *   - 订阅者: 语言修改后，会立即收到通知
   *    this._state.subscribe('settings.lang.systemLang', systemLang =>{
   *        this.systemLang =  systemLang;
   *        this.setLanguage();
   *       });
   *
   * @export
   * @ class GlobalState
   */
  set(event, value) {
    const current = this.data[event];
    if (current !== value) {
      this.data[event] = value;
    }
    this.data.next({
      event,
      data: this.data[event]
    });
  }

  subscribe(event: string, callback: any) {
    const subscribers = this.subscriptions.get(event) || [];
    subscribers.push(callback);

    this.subscriptions.set(event, subscribers);

    const current = this.data[event];
    if (current !== undefined) {
      setTimeout(() => {
        callback.call(null, current);
      });
    }
  }

  unsubscribe(event: string, callback: any) {
    const subscribers = this.subscriptions.get(event) || [];
    const nSubs = [];
    subscribers.forEach(element => {
      if (element !== callback) {
        nSubs.push(element);
      }
    });
    this.subscriptions.set(event, nSubs);
  }

  unsubscribeAll(event: string) {
    this.data[event] = undefined;
    this.subscriptions.set(event, []);
  }

  onEvent(data: any) {
    const subscribers = this.subscriptions.get(data.event) || [];

    subscribers.forEach((callback) => {
      callback.call(null, data.data);
    });
  }
}
