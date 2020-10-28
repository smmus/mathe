class InputValidation {
    constructor(input_string) {
        //100
        //1-100
        //1-100-10
        this.input = [];

        let input = input_string.split('-').map(e => parseInt(e));
        if (input.length === 0) throw new Error('[NO INPUT]');
        if (input.length === 1) this.input = [1, input[0], 1];
        else if (input.length === 2) this.input = [...input, 1];
        else if (input.length === 3) this.input = input;
        else throw new Error('[INVALID INPUT]');

        console.log('[INPUT:InputValidation]', this.input)
    }
}

class CalculatePrime extends InputValidation {
    constructor(input_string) {
        super(input_string);

        let [start, end, step] = this.input;
        CalculatePrime.validateInput(start, end, step);

        this.all_primes = JSON.parse(localStorage.getItem('all_primes')) || [];
        CalculatePrime.isAllPrime(end, this.all_primes);
    }

    static validateInput(start, end, step) {
        console.log("[VALIDATING]");
        if (!(start && end && step && start > 0 && end > 0 && step > 0 && start < end)) {
            //wrong input
            console.error("[WRONG INPUT]: from CalculatePrime");
            throw new Error('[WRONG INPUT]');
        }
    }

    static isAllPrime(end, all_primes) {
        /* This func calculate all primes and mutate the object's all_primes property + set new calculated values in local storage*/

        let starting_point = 1; //calculation will be started form this val
        if (all_primes.length) {
            // if the array is not empty, check how many values has caculated already

            let last_element = all_primes[all_primes.length - 1];
            if (end <= last_element) {
                // means all values are caculated and no need to count(mutate global var)
                return;
            } else {
                // end > last_element
                // some values need to be calculated
                starting_point = last_element + 1; //calculate values from the last prime+1 in the list, so that that prime doesn't get inserted in the array again
            }
        }

        for (let i = starting_point; i <= end; i++) {
            if (CalculatePrime.isPrime(i, all_primes)) {
                // returns bool
                // list not contains that number
                // add it to the list
                //console.info('[new Prime]', i);
                all_primes.push(i);
            }
        }

        //after all calculation, store that array  for future use
        localStorage.setItem('all_primes', JSON.stringify(all_primes));
    }

    static isPrime(num, all_primes) {
        // num == integer > 0; already checked!

        // '1' may come so check it
        if (num < 2) return false;
        else if (num === 2) return true; // 2-only even prime
        else if (!(num % 2)) return false; // even number, not=2
        else {
            //check if divisible by every prime less than sqrt(num)**--> formula of primeNumber
            // all_prime list can never be empty here (min_length==1, while value=2) 
            let sqrt_num = Math.sqrt(num);
            for (let i of all_primes) {
                if (i > sqrt_num) break; // every prime less than(or equal) sqrt(num)
                if (!(num % i)) return false; // if any i can divide num, return false
            }
            return true; // if none returns false than its a prime number
        }
    }
}``

class PrimeFinder extends CalculatePrime {

    constructor(input_string) {
        console.log("[CACULATING]");
        super(input_string);

        this.total_nums = 0; // total numbers
        this.needed_primes = []; // total prime numbers' list
        [this.start, this.end, this.step] = this.input
    }

    updateDom(main_list_element, summary_el, start_number_el, end_number_el) {

        let new_array = this.all_primes.slice(); // all_primes not empty here
        //copying array for efficiency (there are several methods for copying an array)

        // delete those primes which are less than starting number
        // terminating "i > new_array[0]" condition
        while (true) {
            if (!new_array.length || new_array[0] >= this.start) break;
            // break if array is empty OR array[0] > starting_value
            new_array.shift();
        }

        /* here is a problem with step value -solved in the next section
        // after deleting all unnecessary primes, length of the new_array will be the total_primes value
        let total_primes = new_array.length;
        // update dom
        document.querySelector('.totals').innerHTML = total_primes;
        */

        console.log('[Primes]-[after 1st portion deleted] ', new_array);

        let innerHTML = "";

        for (let i = this.start; i <= this.end; i += this.step) {
            // increase total_nums by one;
            this.total_nums++;

            if (!new_array.length || i < new_array[0]) {
                /*Checking if ...
                1. new_array is empty (means no prime left)
                2. or if not empty check current num is less than 1st element of primes 
                */

                // insert them as normal* numbers
                innerHTML += `<span>${i}</span>`;
            }
            else if (i > new_array[0]) {
                new_array.shift();
                // console.log('[Deleted]', new_array.shift())

                innerHTML += `<span>${i}</span>`;
            }
            else {
                // if i==all_primes[0] --> means its a prime number

                /*as we have deleted all i > new_array[0] numbers this condition will never true */

                // insert it as prime*  number
                // and delete the 1st item(prime) of the array

                innerHTML += `<span data-x>${i}</span>`;
                new_array.shift();
                this.needed_primes.push(i);
            }
        }
        console.log('[Needed Primes]', this.needed_primes);

        // after all update the counts and results in DOM
        main_list_element.innerHTML = innerHTML;
        summary_el.innerHTML = `
        <span class="form-group">
            <span>Total Numbers</span>
            <input disabled class="form-field" type="text" value=${this.total_nums}>
        </span>
        <span class="form-group">
            <span>Prime Numbers</span>
            <input disabled class="form-field" type="text" value=${this.needed_primes.length}>
        </span>
        <span class="form-group">
            <span>Non Prime Number</span>
            <input disabled class="form-field" type="text" value=${this.total_nums - this.needed_primes.length}>
        </span>
        `
        start_number_el.value = this.start;
        end_number_el.value = this.end;
    }
}

class FullSquare extends InputValidation {
    constructor(inp) {
        super(inp);

        this.all_squares = JSON.parse(localStorage.getItem('all_squares')) || [];
        this.needed_squares = []; // total full squares numbers' list
        this.total_nums = 0; // total numbers

        let [start, end, step] = this.input;

        FullSquare.calculate_values(this.all_squares, end);
    }

    static calculate_values(all_squares, end) {
        // if already caculated
        if (all_squares[all_squares.length - 1] >= end) return;

        let i = all_squares.length ? Math.sqrt(all_squares[all_squares.length - 1]) + 1 : 1; //starting number == 1 if array is empty else, lastElement+1
        while (i * i <= end) {
            all_squares.push(i * i);
            i++;
        }

        localStorage.setItem('all_squares', JSON.stringify(all_squares));
    }

    updateDom(main_list_el, summary_el, start_number_el, end_number_el) {

        let new_array = this.all_squares.slice();
        //copying array for efficiency 

        // delete those primes which are less than starting number
        // terminating "i > new_array[0]" condition
        while (true) {
            if (!new_array.length || new_array[0] >= this.input[0]) break;
            // break if array is empty OR array[0] > starting_value
            new_array.shift();
        }

        /* here is a problem with step value -solved in the next section
        // after deleting all unnecessary primes, length of the new_array will be the total_primes value
        let total_primes = new_array.length;
        // update dom
        document.querySelector('.totals').innerHTML = total_primes;
        */

        console.log('[Squares]-[after 1st portion deleted] ', new_array);

        let innerHTML = "";

        for (let i = this.input[0]; i <= this.input[1]; i += this.input[2]) {
            // increase total_nums by one;
            this.total_nums++;

            if (!new_array.length || i < new_array[0]) {
                /*Checking if ...
                1. new_array is empty (means no prime left)
                2. or if not empty check current num is less than 1st element of primes 
                */

                // insert them as normal* numbers
                innerHTML += `<span>${i}</span>`;
            }
            else if (i > new_array[0]) {
                new_array.shift();
                // console.log('[Deleted]', new_array.shift())

                innerHTML += `<span>${i}</span>`;
            }
            else {
                // if i==all_primes[0] --> means its a prime number

                /*as we have deleted all i > new_array[0] numbers this condition will never true */

                // insert it as prime*  number
                // and delete the 1st item(prime) of the array

                innerHTML += `<span data-x>${i}</span>`;
                new_array.shift();
                this.needed_squares.push(i);
            }
        }
        console.log('[Needed Squares]', this.needed_squares);

        // after all update the counts and results in DOM
        main_list_el.innerHTML = innerHTML;

        summary_el.innerHTML = `
            <span class="form-group">
                <span>Total Numbers</span>
                <input disabled class="form-field" type="text" value=${this.total_nums}>
            </span>
            <span class="form-group">
                <span>Full Square Numbers</span>
                <input disabled class="form-field" type="text" value=${this.needed_squares.length}>
            </span>
            <span class="form-group">
                <span>Non Full Square Number</span>
                <input disabled class="form-field" type="text" value=${this.total_nums - this.needed_squares.length}>
            </span>
            `
        start_number_el.value = this.input[0]; //start
        end_number_el.value = this.input[1]; //end

    }
}

class PrimeFactor extends CalculatePrime{
    constructor(input){
        super(input);

        this.result = {};
        this.input = this.input[1];
        this.primeFactor();
    }

    primeFactor(){
        // input must be integer
        //if(!Number.isInteger(num)) return; //raise error
    
        // all primes 2-->num
        let index = 0; //for iterating the list
        let num = this.input;
    
        while(num!==1){
            let prime = this.all_primes[index]; // local var
    
            // divide num by primes only if it is divisible
            if(! (num % prime)){ //if num%prime==0
                //if divisible then divide
                num = num / prime; 
                
                // and record it to the this.result
                if(this.result[prime] == undefined){
                    this.result[prime] = 1;
                }else{
                    this.result[prime] += 1;
                }
            }else{
                index++;
            }
        }
    }

    updateDom(main_list_el, summary_el, end_number_el){
        let main_list_innerHTML = ``;
        let summary_innerHTML = ``;
        
        for(let key in this.result){
            
            for(let i = this.result[key]; i > 0; i--){
                main_list_innerHTML += `<span>${key}</span>`;
            } 

            summary_innerHTML += `
                <span class="form-group">
                    <span>${key}</span>
                    <input disabled class="form-field" type="text" value=${this.result[key]}>
                </span>`;
        }

        main_list_el.innerHTML = main_list_innerHTML;
        summary_el.innerHTML = summary_innerHTML;
        end_number_el.value = this.input
    }
}

function main() {
    const VIEW = new URLSearchParams(window.location.search).get('v');
    const INPUT = new URLSearchParams(window.location.search).get('i');
    console.log('[INPUT]:', INPUT)

    try {
        if (VIEW) {
            document.querySelector('.container').innerHTML = `
            <div class="header">
                <h1 style="text-transform:capitalize">${VIEW}</h4>
                <a href='index.html' style='text-decoration:none'> < Main Page</a>
            </div>
            <div class="card card--searchbox">
                <span class="form-group">
                    <span>Start</span>
                    <input class="form-field" id="start_number" type="number" placeholder="1" value="1">
                </span>
                <span class="form-group">
                    <span>End</span>
                    <input class="form-field" id="end_number" type="number" placeholder="100" value="100">
                </span>
                <button type="submit" class="btn pulse">Go</button>
            </div>
            <div class="card">
                <h1 class="card__header">
                    <span class="card__title">Summary</span>
                </h1>
                <div class="card__body" id='summary'>
                </div>
            </div>
            <div class="card">
                <h1 class="card__header">
                    <span class="card__title">Result</span>
                    <select id='show'>
                        <option value=1 selected>Show All</option>
                        <option value=2>Show Only</option>
                        <option value=3>Show Except</option>
                    </select>
                </h1>
                <div class="card__result">
                </div>
            </div>`;

            document.querySelector('.card--searchbox button').onclick = e => {
                let vals = [];

                e.target.parentElement.querySelectorAll('input[type=number]').forEach(el => {
                    el.value && vals.push(el.value);
                })
                window.location.search = window.location.search.includes('i=') ? window.location.search.split('&').map(el => el.includes('i=') ? `i=${vals.join('-')}` : el).join('&') : window.location.search += `&i=${vals.join('-')}`;
            }

            document.getElementById('show').onchange = e => {
                console.log('[SELECT]:', e.target.value)
                switch (e.target.value) {
                    case '1':
                        document.querySelectorAll('.card__result > span').forEach(el => el.style.display = 'flex');
                        break;
                    case '2':
                        document.querySelectorAll('.card__result > span').forEach(el => el.style.display = 'flex');
                        document.querySelectorAll('.card__result > span:not([data-x])').forEach(el => el.style.display = 'none');
                        break;
                    case '3':
                        document.querySelectorAll('.card__result > span').forEach(el => el.style.display = 'flex');
                        document.querySelectorAll('.card__result > span[data-x]').forEach(el => el.style.display = 'none');
                        break;

                }
            }

            if (VIEW == 'primefactor'){
                document.querySelector('.card--searchbox').firstElementChild.remove();
                document.querySelector('.card--searchbox').firstElementChild.firstElementChild.innerText = 'Prime Factor of'
                document.getElementById('show').remove();
            }
        }
        if (INPUT) {
            let main_list_el = document.querySelector('.card__result');
            let summary_el = document.getElementById('summary');
            let start_number_el = document.getElementById('start_number');
            let end_number_el = document.getElementById('end_number');

            if (VIEW == 'primefinder') {
                let obj = new PrimeFinder(INPUT);
                obj.updateDom(main_list_el, summary_el, start_number_el, end_number_el);
                console.dir(obj);
            } else if (VIEW == 'fullsquare') {
                let obj = new FullSquare(INPUT);
                obj.updateDom(main_list_el, summary_el, start_number_el, end_number_el);
                console.dir(obj);
            } else if (VIEW == 'primefactor') {
                let obj = new PrimeFactor(INPUT);
                obj.updateDom(main_list_el, summary_el, end_number_el);
                console.dir(obj);
            }
        }
    } catch (e) {
        console.dir(e);
    }
}
main()