import { Component } from '@angular/core';
import { Kushki } from '@kushki/js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  //Sistema de pago
  kushki: any;
  name: any;
  amount = '';
  cardnumber = "5451951574925480";
  cvc = "345";
  expiryMonth = "12";
  expiryYear = "28";

  //Pruebas
  //Declinada para obtener token ===> 4574441215190335
  //Aprobada para obtener token ===> 5451951574925480
  //Tarjeta no válida ===> 4349003000047015

  animista: boolean;

  constructor(private http: HttpClient,
              private loadingController: LoadingController) {

    this.kushki = new Kushki({
      merchantId: 'e1100b288481480c89f1caf8a0534b65',
      inTestEnvironment: true,
      regional: false
    });

    setTimeout(() => this.animista = true, 1000);
  }

  async tokenLoading() {
    const loading = await this.loadingController.create({
      message: 'Generando token...'
    });

    await loading.present();
  }

  async paymentLoading() {
    const loading = await this.loadingController.create({
      message: 'Realizando el pago...'
    });

    await loading.present();
  }

  generateToken(){    
    //console.log('Creando token');
    this.tokenLoading(); //Loading de carga

    this.kushki.requestToken({
      amount: this.amount,
      currency: "CLP",
      card: {
        name: this.name,
        number: this.cardnumber,
        cvc: this.cvc,
        expiryMonth: this.expiryMonth,
        expiryYear: this.expiryYear
    },
    }, (response) => {

      if(response.token){
        //console.log('Token conseguido ===> Iniciando transacción ===>');
        const token = response.token;
        this.transactionInit(token, this.amount);
        this.loadingController.dismiss();

      } else if(response.error && response.code === '017'){
        //console.log('Transacción declinada');
        this.loadingController.dismiss(); //Detener la carga
        alert('Transacción declinada en el token');

      } else {
        console.log('Error: ',response.error);
        //console.log('Error code: ',response.code);
        //console.log('Error message: ',response.message);
        this.loadingController.dismiss() //Detener la carga
        alert(`${response.message} ${response.code}`);

      }
    });

  }

  transactionInit(token, amount){
    //console.log('Iniciando transacción')
    this.paymentLoading();

    const headers = new HttpHeaders({
      'Private-Merchant-Id': '9139099d084a474ca81479691579531e'
    });

    const data = {
      "token": token,
      "amount": {
        "subtotalIva": 0,
        "subtotalIva0": amount,
        "iva": 0,
        "currency": "CLP"
      },
      "fullResponse": true
    }

    this.http.post('https://api-uat.kushkipagos.com/card/v1/charges', data, { headers })
             .subscribe((response:any) => {
        
      console.log('Funciono ===> ', response);

      if(response.details.responseCode === '000' && response.details.transactionStatus === 'APPROVAL'){
        //console.log('Transacción efectuada con éxito');
        this.loadingController.dismiss();
        alert('Felicidades Transacción realizada con éxito');
      }

    }, (error) => {

      if(error.error.code === '017'){
        //console.log('Transacción declinada');
        //console.log('Motivo: ',error.error.details.responseText);
        this.loadingController.dismiss();
        alert(`${error.error.details.responseText}`);

      } else {
        console.log('Error ===> ',error.error);
        this.loadingController.dismiss();
        alert('Se produjo un error en el pago');

      }
      
    });
  }

}
