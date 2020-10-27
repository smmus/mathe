const VIEW = new URLSearchParams(window.location.search).get('v');
const INPUT = new URLSearchParams(window.location.search).get('i');

class CalculatePrime{
    constructor(end){
        this.isAllPrime(end);
    }
    
    isAllPrime(end){
        /* This func calculate all prime and mutate the global all_primes variable */
    
        let starting_point = 1; //calculation will be started form this val
        if (all_primes.length){
            // if the array is not empty, check how many values has caculated already
            
            let  last_element = all_primes[all_primes.length - 1];
            if (end <= last_element) {
                // means all values are caculated and no need to count(mutate global var)
                return;
            }else{
                // end > last_element
                // some values need to be calculated
                starting_point = last_element + 1; //calculate values from the last prime+1 in the list, so that that prime doesn't get inserted in the array again
            }
        }
    
        for (let i = starting_point; i <= end; i++){
            if(isPrime(i)){ 
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
    
    isPrime(num){
        // num == integer > 0; already checked!
    
        // '1' may come so check it
        if(num < 2) return false;
        else if(num === 2) return true; // 2-only even prime
        else if(!(num % 2)) return false; // even number, not=2
        else {
            //check if divisible by every prime less than sqrt(num)**--> formula of primeNumber
            // all_prime list can never be empty here (min_length==1, while value=2) 
            let sqrt_num = Math.sqrt(num);
            for (let i of all_primes){
                if (i > sqrt_num) break; // every prime less than(or equal) sqrt(num)
                if (!(num%i)) return false; // if any i can divide num, return false
            }
            return true; // if none returns false than its a prime number
        }
    }
}