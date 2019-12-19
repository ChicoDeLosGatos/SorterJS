function Sorter(config) {
    if(config){
        this.verbose = (config.verbose) ? config.verbose : false;
        this.precision = (config.precision) ? config.precision : 0.5; // max 1
        this.iterations = (config.iterations) ? config.iterations : 1;
    }else{
        this.verbose = false;
        this.precision = 0.5;
        this.iterations = 1;
    }
    

    var internalChoices = [];

    this.choices = [];

    this.loadChoices = function() {
        this.choices = internalChoices;
    }


    this.bestChoiceFor = function(type) {

        var best = -1;
        for (var i = 0; i < this.choices.length; i++) {
            if (this.choices[i][0] == type) {
                best = this.choices[i][1];
            }
        }
        return best;
    };

    var random = {
        ints: function(max) {
            var array = [];
            for (var x = 0; x < max; x++) {
                array.push(Math.floor(Math.random() * 1000) + 1);
            }
            return array;
        },
        dbls: function(max) {
            var array = [];
            for (var x = 0; x < max; x++) {
                array.push(Math.random() * 1000);
            }
            return array;
        },
        chrs: function(max) {
            var array = [];
            for (var x = 0; x < max; x++) {
                var value = ((Math.floor(Math.random() * 10) + 1) * 25) + 5;

                try {
                    array.push(String.fromCharCode(value));
                } catch (err) {
                    array.push(String.fromCharCode((Math.floor(Math.random() * 60) + 1)));
                }

            }
            return array;
        },
        strs: function(max) {
            var array = [];
            for (var x = 0; x < max; x++) {
                array.push(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
            }
            return array;
        }
    };


    this.calibrate = function() {
        for (var i = 0; i < this.iterations; i++) {
            if (this.iterations > 1) lg("Iteration " + (i + 1));

            var cal = (Math.floor(Math.random() * (this.precision * 1000 * this.precision)) + (this.precision * 100 * this.precision)) * (this.precision * 10 * this.precision) ^ 2;
            lg("Calibrator value: " + cal);

            lg("******* Calibrating ints... *******");
            calibrateTypeArray(random.ints(cal));
            lg("******* Calibrating dbls... *******");

            calibrateTypeArray(random.dbls(cal));
            lg("******* Calibrating chrs... *******");

            calibrateTypeArray(random.chrs(cal));
            lg("******* Calibrating strs... *******");

            calibrateTypeArray(random.strs(cal));

            this.loadChoices();
        }

        lg("SmartSort calibrated.");
        lg("*****************************************");
        lg("\tType\t \tAlgorythm\t");
        lg("*****************************************");
        for (var i = 0; i < internalChoices.length; i++) {
            var type = internalChoices[i][0];
            var alg = "";
            switch (internalChoices[i][1]) {
                case 0:
                    alg = "Bubble";
                    break;
                case 1:
                    alg = "Insertion";
                    break;
                case 2:
                    alg = "Selection";
                    break;
                case 3:
                    alg = "Shell";
                    break;
                case 4:
                    alg = "Merge";
                    break;
                case 5:
                    alg = "Quick";
                    break;
            }

            lg("\t" + type + "\t \t" + alg + "\t");

        }
    };

    function calibrateTypeArray(array) {
        var type = typeof array[0];

        isBestChoice(type, 0, monitorize(0, array));
        isBestChoice(type, 1, monitorize(1, array));
        isBestChoice(type, 2, monitorize(2, array));
        isBestChoice(type, 3, monitorize(3, array));
        isBestChoice(type, 4, monitorize(4, array));
        isBestChoice(type, 5, monitorize(5, array));

    };

    function monitorize(func, array) {
        var ini = window.performance.now();
        switch (func) {
            case 0:
                bs(array);
                lg("Monitorizing bubbleSort [" + func + "]");
                break;
            case 1:
                is(array);
                lg("Monitorizing insertionSort [" + func + "]");
                break;
            case 2:
                ss(array);
                lg("Monitorizing selectionSort [" + func + "]");
                break;
            case 3:
                shs(array);
                lg("Monitorizing shellSort [" + func + "]");
                break;
            case 4:
                ms(array);
                lg("Monitorizing mergeSort [" + func + "]");
                break;
            case 5:
                qs(array);
                lg("Monitorizing quickSort [" + func + "]");
                break;
        }
        return window.performance.now() - ini;
    };

    function isBestChoice(type, idx, time) {
        var currentChoice = [];
        for (var i = 0; i < internalChoices.length; i++) {
            if (internalChoices[i][0] == type && internalChoices[i][2] > time) {
                internalChoices[i] = [type, idx, time];
                currentChoice = internalChoices[i];
                lg("New best choice for " + type + ": " + idx + " (" + time + ")");
            } else {
                if (internalChoices[i][0] == type) {
                    currentChoice = internalChoices[i];
                }
            }
        }

        if (currentChoice.length == 0) {
            internalChoices.push([type, idx, time]);
            lg("Added type " + type + ": " + idx + " (" + time + ")");

        }

        return ([type, idx, time] == currentChoice);

    };


    function bs(arr) {
        var l = arr.length;
        for (var i = 0; i < l; i++) {
            for (var j = 0; j < l - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
        }
    };


    function is(arr) {
        var l = arr.length;
        var j, temp;

        for (var i = 1; i < l; i++) {
            j = i;
            temp = arr[i];
            while (j > 0 && arr[j - 1] > temp) {
                arr[j] = arr[j - 1];
                j--;
            }
            arr[j] = temp;
        }
    };


    function ss(arr) {
        var iMin;
        for (var j = 0; j < arr.length; ++j) {
            var i = iMin = j;
            for (++i; i < arr.length; ++i) {
                (arr[i] < arr[iMin]) && (iMin = i);
            }
            [arr[j], arr[iMin]] = [arr[iMin], arr[j]];
        }
    };


    function shs(arr) {
        var gap = arr.length;
        var h = 1;
        while (h < gap / 3) {
            h = 3 * h + 1;
        }
        while (h >= 1) {
            for (var i = h; i < gap; i++) {
                for (var j = i; j >= h && arr[j] < arr[j - h]; j -= h) {
                    [arr[j], arr[j - h]] = [arr[j - h], arr[j]];
                }
            }
            h = (h - 1) / 3;
        }
    };


    function ms(arr) {

        function merge(leftArr, rightArr) {
            var sortedArr = [];
            while (leftArr.length && rightArr.length) {
                if (leftArr[0] <= rightArr[0]) {
                    sortedArr.push(leftArr[0]);
                    leftArr = leftArr.slice(1)
                } else {
                    sortedArr.push(rightArr[0]);
                    rightArr = rightArr.slice(1);
                }

            }
            while (leftArr.length) {
                sortedArr.push(leftArr.shift());
            }

            while (rightArr.length) {
                sortedArr.push(rightArr.shift());
            }

            return sortedArr;
        }

        if (arr.length < 2) {
            return arr;
        } else {
            var midpoint = parseInt(arr.length / 2);
            var leftArr = arr.slice(0, midpoint);
            var rightArr = arr.slice(midpoint, arr.length);
            return merge(ms(leftArr), ms(rightArr));
        }
    };


    this.quickSort = function(array) {
        qs(array);
    };
    this.bubbleSort = function(array) {
        bs(array);
    };
    this.insertionSort = function(array) {
        is(array);
    };
    this.selectionSort = function(array) {
        ss(array);
    };
    this.mergeSort = function(array) {
        ms(array);
    };
    this.shellSort = function(array) {
        shs(array);
    };

    this.log = function(text, opt) {
        lg(text, opt);
    };

    function qs(array, left, right) {

        function partition(array, left, right) {

            function swap(array, leftIndex, rightIndex) {
                var left = array[leftIndex],
                    right = array[rightIndex];

                array[leftIndex] = right;
                array[rightIndex] = left;
            }

            var pivot = array[Math.floor((left + right) / 2)],
                i = left,
                j = right;


            while (i <= j) {

                while (array[i] < pivot) {
                    i++;
                }

                while (array[j] > pivot) {
                    j--;
                }

                if (i <= j) {
                    swap(array, i, j);
                    i++;
                    j--;
                }
            }
            return i;
        }


        var index;
        if (array.length > 1) {
            index = partition(array, left, right);
            if (left < index - 1) {
                qs(array, left, index - 1);
            }

            if (index < right) {
                qs(array, index, right);
            }

        }
    };


    function lg(text, notime) {
        if(config)
        if (config.verbose) {
            if (notime) console.log(text);
            else console.log("[" + window.performance.now() + "]:", text);
        }
    }



    this.calibrate();


}


Sorter.prototype.sort = function(arr, reverse) {
    var type = typeof arr[0];
    var choice = this.bestChoiceFor(type);

    if (choice == -1) {
        this.calibrate();
        choice = this.bestChoiceFor(type);
    }

    switch (choice) {
        case 0:
            this.bubbleSort(arr);
            this.log("I will use bubbleSort");
            break;
        case 1:
            this.insertionSort(arr);
            this.log("I will use insertionSort");
            break;
        case 2:
            this.selectionSort(arr);
            this.log("I will use selectionSort");
            break;
        case 3:
            this.shellSort(arr);
            this.log("I will use shellSort");
            break;
        case 4:
            this.mergeSort(arr);
            this.log("I will use mergeSort");
            break;
        case 5:
            this.quickSort(arr);
            this.log("I will use quickSort");
            break;
    }
    
    if(reverse) arr.reverse();
}
