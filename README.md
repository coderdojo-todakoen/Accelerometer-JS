# micro:bitの加速度センサの値をJavaScriptで取得
[micro:bitの加速度センサの値をUnityで取得](https://github.com/coderdojo-todakoen/Accelerometer)と同じことを、 ブラウザのみでおこないます。
Web Bluetooth APIを使用してJavaScriptでmicro:bitと通信し、取得した加速度計の値をもとにmicro:bitの傾きを、WEBGLを使用してブラウザ上に表示します。

## 動作環境
### MacOS
- MacOS Catalina 10.15.6
- Google Chrome 84

でのみ動作の確認をおこないました。  
BluetoothをONにしてください。micro:bitとペアリングしておく必要はありません。

### micro:bit
microbitフォルダにあるhexファイルを、micro:bitに書き込みます。

## 動作方法
- あらかじめ[micro:bit用のバイナリファイル](https://github.com/coderdojo-todakoen/Accelerometer-JS/tree/master/microbit)をmicro:bitに書き込んでください。
- ChromeのようなWeb Bluetooth APIに対応したブラウザを使用して、https://coderdojo-todakoen.github.io/Accelerometer-JS/ へアクセスします。
- [Connect]ボタンをクリックして、一覧に表示されたデバイスを選択します。
