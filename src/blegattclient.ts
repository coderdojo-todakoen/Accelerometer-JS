export default class BLEGATTClient {
  static readonly ACCELEROMETER_SERVICE_UUID = 'e95d0753-251d-470a-a062-fa1922dfa9a8';
  static readonly ACCELEROMETER_DATA_CHARACTERISTIC_UUID = 'e95dca4b-251d-470a-a062-fa1922dfa9a8';
  static readonly ACCELEROMETER_PERIOD_CHARACTERISTIC_UUID = 'e95dfb24-251d-470a-a062-fa1922dfa9a8';
  static readonly MAGNETOMETER_SERVICE_UUID = 'e95df2d8-251d-470a-a062-fa1922dfa9a8';
  static readonly MAGNETOMETER_DATA_CHARACTERISTIC_UUID = 'e95dfb11-251d-470a-a062-fa1922dfa9a8';
  static readonly MAGNETOMETER_PERIOD_CHARACTERISTIC_UUID = 'e95d386c-251d-470a-a062-fa1922dfa9a8';
  static readonly MAGNETOMETER_BEARING_CHARACTERISTIC_UUID = 'e95d9715-251d-470a-a062-fa1922dfa9a8';
  static readonly MAGNETOMETER_CALIBRATION_CHARACTERISTIC_UUID = 'e95db358-251d-470a-a062-fa1922dfa9a8';
  static readonly BUTTON_SERVICE_UUID = 'e95d9882-251d-470a-a062-fa1922dfa9a8';
  static readonly BUTTON_A_STATE_CHARACTERISTIC_UUID = 'e95dda90-251d-470a-a062-fa1922dfa9a8';
  static readonly BUTTON_B_STATE_CHARACTERISTIC_UUID = 'e95dda91-251d-470a-a062-fa1922dfa9a8';

  device = null;

  // micro:bitの加速度計のX軸の値を返します
  accelerometerDataX = 0;
  // micro:bitの加速度計のY軸の値を返します
  accelerometerDataY = 0;
  // micro:bitの加速度計のZ軸の値を返します
  accelerometerDataZ = 0;
  // micro:bitのボタンAの状態を返します
  buttonAState = 0;
  // micro:bitのボタンBの状態を返します
  buttonBState = 0;

  async connectDevice() {
    if (navigator.bluetooth == null) {
      alert('Chromeなどの、Web Bluetooth APIに対応したブラウザを使用してください。');
      return;
    }

    try {
      console.log('requestDevice');
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          // Androidでデバイスが検出できないので、optionalServicesにする
          //{ services: [BLEGATTClient.ACCELEROMETER_SERVICE_UUID, BLEGATTClient.BUTTON_SERVICE_UUID] },
          { namePrefix: 'BBC micro:bit' }
        ],
        optionalServices: [BLEGATTClient.ACCELEROMETER_SERVICE_UUID, BLEGATTClient.BUTTON_SERVICE_UUID]
      });

      console.log('connect');
      const server = await this.device.gatt.connect();

      // micro:bitの加速度計サービスを取得します
      console.log('getPrimaryService(ACCELEROMETER_SERVICE_UUID)');
      const accelerometerService = await server.getPrimaryService(BLEGATTClient.ACCELEROMETER_SERVICE_UUID);

      // micro:bitの加速度計の値の取得間隔を20msに設定します
      console.log('getCharacteristic(ACCELEROMETER_PERIOD_CHARACTERISTIC_UUID)');
      const periodCharacteristic = await accelerometerService.getCharacteristic(BLEGATTClient.ACCELEROMETER_PERIOD_CHARACTERISTIC_UUID);

      console.log('writeValue');
      const period = new Uint16Array([20]);
      await periodCharacteristic.writeValue(period);

      // micro:bitの加速度計の値の通知を受け取るよう設定します
      console.log('getCharacteristic(ACCELEROMETER_DATA_CHARACTERISTIC_UUID)');
      const dataCharacteristic = await accelerometerService.getCharacteristic(BLEGATTClient.ACCELEROMETER_DATA_CHARACTERISTIC_UUID);

      console.log('startNotifications');
      await dataCharacteristic.startNotifications();

      dataCharacteristic.addEventListener('characteristicvaluechanged', (ev) => {
        // micro:bitの加速度計の値の通知を受け取ったら呼び出されます
        const value = ev.target.value;
        this.accelerometerDataX = 0.8 * this.accelerometerDataX + 0.2 * value.getInt16(0, true);
        this.accelerometerDataY = 0.8 * this.accelerometerDataY + 0.2 * value.getInt16(2, true);
        this.accelerometerDataZ = 0.8 * this.accelerometerDataZ + 0.2 * value.getInt16(4, true);
      });

      // micro:bitのボタンサービスを取得します
      console.log('getPrimaryService(BUTTON_SERVICE_UUID)');
      const buttonService = await server.getPrimaryService(BLEGATTClient.BUTTON_SERVICE_UUID);

      // micro:bitのボタンAの通知を受け取るよう設定します
      console.log('getCharacteristic(BUTTON_A_STATE_CHARACTERISTIC_UUID)');
      const buttonACharacteristic = await buttonService.getCharacteristic(BLEGATTClient.BUTTON_A_STATE_CHARACTERISTIC_UUID);

      console.log('startNotifications');
      await buttonACharacteristic.startNotifications();

      buttonACharacteristic.addEventListener('characteristicvaluechanged', (ev) => {
        // micro:bitのボタンAの通知を受け取ったら呼び出されます
        const value = ev.target.value;
        this.buttonAState = value.getUint8();
      });

      // micro:bitのボタンBの通知を受け取るよう設定します
      console.log('getCharacteristic(BUTTON_B_STATE_CHARACTERISTIC_UUID)');
      const buttonBCharacteristic = await buttonService.getCharacteristic(BLEGATTClient.BUTTON_B_STATE_CHARACTERISTIC_UUID);

      console.log('startNotifications');
      await buttonBCharacteristic.startNotifications();

      buttonBCharacteristic.addEventListener('characteristicvaluechanged', (ev) => {
        // micro:bitのボタンBの通知を受け取ったら呼び出されます
        const value = ev.target.value;
        this.buttonBState = value.getUint8();
      });
    } catch (error) {
      console.log(error);
    }
  }

  async disconnectDevice() {
    if (navigator.bluetooth == null) {
      alert('Chromeなどの、Web Bluetooth APIに対応したブラウザを使用してください。');
      return;
    }

    console.log('disconnect');
    await this.device.gatt.disconnect();
  }
}
