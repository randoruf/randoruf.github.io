const A: number[] = [1, 2]; 
const B: string[] = ['a', 'b', 'c'];


Observable.interval(5000)
        .flatMap(a => Observable.fromArray(A)
                                 .flatMap(b=> 
                                     Observable.fromArray(B)
                                 ))
        .subscribe(o => {
            
        });