import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, interval, Subscription, of} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{

  //private subscription: Subscription[] = []; // with this one w'ill use foreach to apply unsubscribe on each element of the array.
  private subscription: Subscription = new Subscription(); //with this one w'ill use add function to add all subscription then stop them without using foreach.

  ngOnInit(): void {

    const observer = {
      next:(item : unknown) => console.log(`Une boitte arrive ${item}`),
      error: (err: unknown) => console.log(`Oups il ya eu une erreur ${err}`),
      complete: () => console.log('Terminé.. plus rien')
    };

    const stream = new Observable(myObserver =>{
      myObserver.next('boite 1');
      myObserver.next('boite 2');
      myObserver.next('boite 3');
      myObserver.complete();
    });

    const subscription =  stream.subscribe(
      item => console.log(`Une boitte arrive ${item}`),
      err=> console.log(`Oups il ya eu une erreur ${err}`),
      () => console.log('Terminé.. plus rien')
    ); // A defaut de créer un objet on peut passer directement les valeurs dans le subsribe.

    subscription.unsubscribe();

    const double = (source: Observable<Number>)=>
      new Observable<number>((subscriber) => {
        const subscription = source.subscribe({
          next: (value:any) => subscriber.next(2 * value),
          error: (err)=> subscriber.error(),
          complete: ()=> subscriber.complete()
        });

        return ()=>{
          subscription.unsubscribe();
        }
      })
      of(1, 2, 3, 4)
      .pipe(
        double,
        double
        )
      .subscribe();
    }

  public start():void{
    this.subscription.add(interval(1000).subscribe(
      value => console.log('ma valeur:', value),
      error => console.log(error),
      () => console.log('terminé')
    ))

    this.subscription.add(interval(1000).subscribe(
      value => console.warn('== ma valeur ==:', value),
      error => console.warn(error),
      () => console.log('terminé')
    ))
  }

  public stop():void{
    this.subscription.unsubscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
