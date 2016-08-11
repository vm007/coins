describe('CoinAppTest', function() {
    beforeEach(module('bbc'));
    var $ctrl;
    var event, inputField, eventProcessor;
    beforeEach(inject(function(_$controller_)
    {
        $ctrl = _$controller_;
        inputField = document.createElement("input");
        inputField.setAttribute("type", "text");
        event = document.createEvent('Event');
        event.keyCode = 13;
        event.initEvent('keypress', true, false);
        document.body.appendChild(inputField);
        eventProcessor = function(scope) {
            inputField.addEventListener("keypress", scope.doCalc(event));
            inputField.dispatchEvent(event);
        };
    }));
    describe('CoinController', function() {
        it('checks double decimals are invalid', function() {
            var myScope = {};
            var controller = $ctrl('CoinController', {$scope: myScope});
            myScope.val = "22.9.8";
            eventProcessor(myScope);
            expect(myScope.message).toEqual('too many decimals');
        });
        it('checks invalid characters are caught', function() {
            var myScope = {};
            var controller = $ctrl('CoinController', {$scope: myScope});
            myScope.val = "22.9a";
            eventProcessor(myScope);
            expect(myScope.message).toEqual('invalid value');
        });
        it('checks empty amount is invalid', function() {
            var myScope = {};
            var controller = $ctrl('CoinController', {$scope: myScope});
            myScope.val = "";
            eventProcessor(myScope);
            expect(myScope.message).toEqual('no value supplied');
        });
        it('checks amount with only currency symbol is invalid', function() {
            var myScope = {};
            var controller = $ctrl('CoinController', {$scope: myScope});
            myScope.val = "£p";
            eventProcessor(myScope);
            expect(myScope.message).toEqual('no value supplied');
        });
        it('checks amount with embedded spaces is invalid', function() {
            var myScope = {};
            var controller = $ctrl('CoinController', {$scope: myScope});
            myScope.val = "£1 2";
            eventProcessor(myScope);
            expect(myScope.message).toEqual('invalid value');
        });
        it('checks p not at the end of the amount is caught', function() {
            var myScope = {};
            var controller = $ctrl('CoinController', {$scope: myScope});
            myScope.val = "22.p9";
            eventProcessor(myScope);
            expect(myScope.message).toEqual('invalid value');
        });
        it('accepts £', function() {
            var myScope = {};
            var controller = $ctrl('CoinController', {$scope: myScope});
            myScope.val = "£2";
            eventProcessor(myScope);
            expect(myScope.message).toEqual('200p = 1 £2');
        });
        it('accepts £ and pence', function() {
            var myScope = {};
            var controller = $ctrl('CoinController', {$scope: myScope});
            myScope.val = "£2.5p";
            eventProcessor(myScope);
            expect(myScope.message).toEqual('250p = 1 £2+1 50p');
        });
        it('accepts decimal without £ and pence', function() {
            var myScope = {};
            var controller = $ctrl('CoinController', {$scope: myScope});
            myScope.val = "2.5";
            eventProcessor(myScope);
            expect(myScope.message).toEqual('250p = 1 £2+1 50p');
        });
        it('accepts number without decimal or £/pence', function() {
            var myScope = {};
            var controller = $ctrl('CoinController', {$scope: myScope});
            myScope.val = "250";
            eventProcessor(myScope);
            expect(myScope.message).toEqual('250p = 1 £2+1 50p');
        });
        it('ignores more than 2 places after decimal', function() {
            var myScope = {};
            var controller = $ctrl('CoinController', {$scope: myScope});
            myScope.val = "2.509567";
            eventProcessor(myScope);
            expect(myScope.message).toEqual('250p = 1 £2+1 50p');
        });
    });
});