import { Component } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx'

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  encodeData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;

  constructor(private barcodeScanner: BarcodeScanner) {

    this.encodeData = 'https://www.freakyjolly.com/';

    //Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    }

  }

  scanCode(){
    this.barcodeScanner.scan().then((scannedData) => {
      console.log('Scanned data', scannedData);
    }).catch((error) => {
      console.log('Ocurrio un error', error);
    });
  }

  encodeText(){
    this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, this.encodeData).then((encodedData) => {
      console.log(this.encodeData);
    }, error => {
      console.log('Algo salio mal paso 1', error);
    }).catch((error) => {
      console.log('Algo salió mal en ENCODED', error);
    });
  }

}
