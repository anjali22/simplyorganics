import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http';


import {Product} from '../models/product';
import {CartItem} from '../models/cart-item';
import { ShoppingCart } from '../models/shopping-cart';
import {DeliveryOption} from '../models/delivery-options';
import {DeliveryOptionsDataService} from './delivery-options.service';
import { StorageService} from './storage.service';
import { ProductService } from './product.service';

const CART_KEY = 'cart';

@Injectable()
export class ShoppingCartService {
  public items: Product[];
  private storage: Storage;
  private subscriptionObservable: Observable<ShoppingCart>;
  private subscribers: Array<Observer<ShoppingCart>> = new Array<Observer<ShoppingCart>>();
  private deliveryOptions: DeliveryOption[];


  constructor(private storageService: StorageService,
              private productService: ProductService,
              private http: HttpClient
            )
  {
    this.storage = this.storageService.get();
    this.subscriptionObservable = new Observable<ShoppingCart>((observer: Observer<ShoppingCart>) => {
      this.subscribers.push(observer);
      observer.next(this.retrieve());
      return () => {
        this.subscribers = this.subscribers.filter((obs) => obs !== observer);
      };
    });
  }

  getProduct(cart, productId): void {
    this.productService.getPPQList()
      .subscribe(products => {
        this.items = products['results'],
          console.log('products', products);
        this.calculateCart(cart);
        this.save(cart);
        this.dispatch(cart);
      },
      err => {
        console.log(err);
      }
      );
  }

  public get(): Observable<ShoppingCart> {
    return this.subscriptionObservable;
  }

  public addItem(product: Product, quantity: number): void {
    const cart = this.retrieve();
    let item = cart.items.find((p) => p.productId === product.ppq_id);
    if (item === undefined) {
      item = new CartItem();
      item.productId = product.ppq_id;
      // item.measure = product.quantity;
      cart.items.push(item);
    }

    item.quantity = quantity;
    cart.items = cart.items.filter((cartItem) => cartItem.quantity > 0);
    if (cart.items.length === 0) {
      cart.deliveryOptionId = undefined;
    }
    this.getProduct(cart, item.productId);

  }

  private calculateCart(cart: ShoppingCart): void {
    cart.itemsTotal = cart.items
      .map((item) => (
        item.quantity * this.items.find((p) => (
          p.ppq_id === item.productId))
            .prod_price))
      .reduce((previous, current) => previous + current, 0);
      console.log('itemsTotal', cart.itemsTotal);
      // cart.deliveryTotal = cart.deliveryOptionId ? this.deliveryOptions.find((x) => x.id === cart.deliveryOptionId).price : 0;
      cart.grossTotal = cart.itemsTotal; //  + cart.deliveryTotal;
  }

  private retrieve(): ShoppingCart {
    const cart = new ShoppingCart();
    const storedCart = this.storage.getItem(CART_KEY);
    if (storedCart) {
      cart.updateFrom(JSON.parse(storedCart));
    }

    return cart;
  }

  private save(cart: ShoppingCart): void {
    this.storage.setItem(CART_KEY, JSON.stringify(cart));
  }

  private dispatch(cart: ShoppingCart): void {
    this.subscribers
      .forEach((sub) => {
        try {
          sub.next(cart);
        } catch (e) {
          // we want all subscribers to get the update even if one errors.
        }
      });
  }

  public empty(): void {
    const newCart = new ShoppingCart();
    this.save(newCart);
    this.dispatch(newCart);
  }

}
