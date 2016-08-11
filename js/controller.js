angular.module('bbc').controller('CoinController', ['$scope', function($scope) {
   $scope.val = 10;
   $scope.message = "enter value and press return";
   valToCalc = 0;
   // coin values in descending order
   coins = [200, 100, 50, 20, 10, 5, 2, 1];
   // strings to be displayed for various coins
   coinStrings = ['£2', '£1', '50p', '20p', '10p', '5p', '2p', '1p'];
   $scope.doCalc = function($event) {
       // keyCode 13 is <Enter Key>
       if($event.keyCode === 13) {
            if(isValid($scope.val)) {
                $scope.message = valToCalc;
                breakItUp();
            }
        }
   };
   
   // find the various coins starting from largest to lowest
   breakItUp = function() {
       var toCalc = valToCalc;
       var msg = "";
       var num = 0;
       var firstTime = true;
       for(var i = 0; i < coins.length; i++) {
           num = Math.floor(toCalc/coins[i]);
           if(num !== 0) {
               msg += (firstTime ? "" : "+") + num + " " + coinStrings[i];
               toCalc -= num * coins[i];
               firstTime = false;
           }
       }
       $scope.message += "p = " + msg.trim();
   };
   
   // check if the amount entered is valid and calculates equivalend pence
   // and puts it valToCalc variable
   isValid = function(myVal) {
       var idx;
       var multiplier = 1;
       if (typeof myVal === "number") {
           $scope.message = "its a number";
           valToCalc = myVal;
           return true;
       }
       myVal = myVal.trim();
       if(myVal.length === 0) {
           $scope.message = "no value supplied";
           return false;
       }
       if(myVal.charAt(0) === '£') {
           $scope.message = "it's a pound";
           myVal = myVal.substr(1);
           multiplier = 100;
        }
       if(myVal.charAt(myVal.length - 1) === 'p') {
           $scope.message = "it's a pence";
           myVal = myVal.substr(0, myVal.length-1);
       }
       if((idx = myVal.indexOf('.')) !== -1) {
           if(idx === myVal.lastIndexOf('.')) {
               $scope.message = " it has a decimal";
               var tmp = myVal.substr(0, idx);
               var tmp1 = myVal.substr(idx+1) + "00";
               if((tmp == parseInt(tmp)) && (tmp1 == parseInt(tmp1))) {
                   var tmp2 = Math.round(tmp1/100);
                   valToCalc = parseInt(tmp) * 100 + parseInt(tmp1.substr(0, 2));
                   return true;
               }
               $scope.message = "invalid value";
               return false;
           } else {
               $scope.message = "too many decimals";
               return false;
           }
       }
       if(myVal === "") {
           $scope.message = "no value supplied";
           return false;
       }
       valToCalc = myVal * multiplier;
       if(Number.isNaN(valToCalc)) {
           $scope.message = "invalid value";
           return false;
       }
       return true;
   };
}]);