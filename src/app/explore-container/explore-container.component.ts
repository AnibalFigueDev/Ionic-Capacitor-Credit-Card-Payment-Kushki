import { Component, OnInit, Input } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import * as CryptoJS from 'crypto-js';


import { get } from "scriptjs";
declare var Mercadopago;


//Plugins
const { Browser } = Plugins;
const { Geolocation } = Plugins;
const { Modals } = Plugins;
const { Network } = Plugins;
const { Share } = Plugins;
const { Storage } = Plugins;
const { Toast } = Plugins;

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  @Input() name: string;

  constructor(private http: HttpClient) {

    //Check internet status;
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network state',status);
    });
  }

  ngOnInit() {
    get("https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js", () => {
      this.initializeMP();
    });

  }

  initializeMP() {
    console.log('Mercado Pago',Mercadopago);
    //console.log('Mercado Pago Key',Mercadopago.key);
    Mercadopago.setPublishableKey("TEST-2828ba6d-a063-45f3-86af-46727d5246a9");
    console.log(Mercadopago.getPaymentMethod({ bin: "450995" }, this.callback));
    console.log(Mercadopago.getPaymentMethod({"payment_method_id": "visa"}, this.callback));
    console.log(Mercadopago.getIdentificationTypes(this.callback));
    console.log(Mercadopago.getIssuers('master', this.callback))

  }

  callback(status: any, response: any) {
    console.log(status);
    console.log(response);
  }













  async openBrowser() {
    await Browser.open({ url: 'http://google.com/'});
    console.log('Opening browser')
  }

  async getCurrentPosition() {
    //await Geolocation.getCurrentPosition().then((data) => {
    //  console.log(data);
    //});

    const coordinates = await Geolocation.getCurrentPosition();
    console.log(coordinates);
  }

  async watchPosition() {
    const watch = await Geolocation.watchPosition({}, (position) => {
      console.log(watch);
      console.log(position);
    });
  }

  //Modals
  async showAlert(){
    await Modals.alert({
      title: 'Alerta 1',
      message: 'Esta es una alerta'
    })
  }

  async showConfirm(){
    let confirm = await Modals.confirm({
      title: 'Confirma',
      message: 'Estas seguro?'
    });

    console.log('Confirm value', confirm);
  }

  async showPrompt(){
    let prompt = await Modals.prompt({
      title: 'Hola',
      message: 'Cual es tu nombre?'
    });

    console.log('Prompt Value', prompt);
  }

  async checkStatusNetwork() {
    let status = await Network.getStatus();
    console.log(status);
  }

  async share() {
    await Share.share({
      title: 'Título de Shared',
      text: 'Es importante que veas esto!',
      url: 'http://ionicframework.com/',
      dialogTitle: 'Comparte con tus amigos!'
    });
  }

  async setData() {
    const data = {
      name: 'Madeleyn',
      edad: '15'
    }

    console.log(data);

    Storage.set({ key: 'data', value: JSON.stringify(data)});
  }

  async getData() {
    const data = await Storage.get({ key: 'data'});
    console.log(JSON.parse(data.value));
  }

  async removeData() {
    await Storage.remove({ key: 'data' });
  }

  async toastShow() {
    await Toast.show({
      text: 'Hello!'
    });
  }

  postFlow(){
    //Secret Key
    const secretKey = '67ef4b152465d770c58faec4a3e274b6d98386ea';
    console.log(secretKey);

    //Params
    const apiKey = '7D549A4F-6A4E-4FB7-9DCB-8D13D2B0L6BB';
    let currency = 'CLP';
    let amount = 5000;
    const stringSign = `amount${amount}apiKey${apiKey}currency${currency}`;
    console.log(stringSign);

    const sign = CryptoJS.HmacSHA256(stringSign, secretKey);
    console.log(sign);

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const data = {
      apiKey: apiKey,
      commerceOrder: '999992323',
      subject: 'Pago de órden',
      amount: '5000',
      email: 'Anibaljeesus19972@gmail.com',
      urlConfirmation: 'quicknowspa.com',
      urlReturn: 'store.quicknowspa.com',
      s: sign
    };

    console.log(data);
    this.http.post('https://sandbox.flow.cl/api/payment/createEmail', data, {headers}).subscribe((response) => {
     console.log(response);
    });
  }

  getPaidsMercado(){
    //Secret Key
    const AccessToken = 'TEST-8401067158033847-071216-d535a28070182b41a1144cc07c37ae36-608277264';

    this.http.get(`https://api.mercadopago.com/v1/payment_methods?access_token=${AccessToken}`).subscribe((response) => {
     console.log(response);
    }, error => {
      console.log(error);
    });
  }

  getIdMercado(){
    //Secret Key
    const AccessToken = 'TEST-8401067158033847-071216-d535a28070182b41a1144cc07c37ae36-608277264';

    this.http.get(`https://api.mercadopago.com/v1/identification_types?access_token=${AccessToken}`).subscribe((response) => {
     console.log(response);
    }, error => {
      console.log(error);
    });
  }

  createPaidMercado(){
    //Secret Key
    const AccessToken = 'TEST-8401067158033847-071216-d535a28070182b41a1144cc07c37ae36-608277264';
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const data = {
      "token":"b3a7dbec3eb0d71798c4f19fec445795",
      "installments":1,
      "transaction_amount":58.80,
      "description":"Point Mini a maquininha que dá o dinheiro de suas vendas na hora",
      "payment_method_id":"visa",
      "payer":{
        "email":"test_user_123456@testuser.com",
        "identification": {
                      "number": "19119119100",
                      "type": "CPF"
                  }
      },
      "notification_url":"https://www.suaurl.com/notificacoes/",
      "sponsor_id":null,
      "binary_mode":false,
      "external_reference":"MP0001",
      "statement_descriptor":"MercadoPago",
      "additional_info":{
        "items":[
        {
          "id":"PR0001",
          "title":"Point Mini",
          "description": "Producto Point para cobros con tarjetas mediante bluetooth",
          "picture_url":"https://http2.mlstatic.com/resources/frontend/statics/growth-sellers-landings/device-mlb-point-i_medium@2x.png",
          "category_id": "electronics",
          "quantity":1,
          "unit_price":58.80
        }
        ],
        "payer":{
          "first_name":"Nome",
          "last_name":"Sobrenome",
          "address":{
            "zip_code":"06233-200",
            "street_name":"Av das Nacoes Unidas",
            "street_number":3003
          },
          "registration_date":"2019-01-01T12:01:01.000-03:00",
          "phone":{
            "area_code":"011",
            "number":"987654321"
          }
        },
        "shipments":{
          "receiver_address":{
            "street_name":"Av das Nacoes Unidas",
            "street_number":3003,
            "zip_code":"06233200",
            "city_name": "Buzios",
            "state_name": "Rio de Janeiro"
          }
        }
        }
    }
    console.log(data);

    this.http.post(`https://api.mercadopago.com/v1/payments?access_token=${AccessToken}`,data,{headers}).subscribe((response) => {
     console.log(response);
    }, error => {
      console.log(error.error);
    });
  }
}
