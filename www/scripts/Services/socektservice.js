// angular.module('MyApp').service('SocketService', ['socketFactory', function SocketService(socketFactory) {
//     return socketFactory({
//         ioSocket: io.connect('http://localhost:8082')
//     });
// }]);


angular.module('MyApp').service(
    "trafficCop",
    function setupService() {
        // I keep track of the total number of HTTP requests that have been
        // initiated with the application.
        var total = {
            all: 0,
            get: 0,
            post: 0,
            delete: 0,
            put: 0,
            head: 0
        };
        // I keep track of the total number of HTTP requests that have been
        // initiated, but have not yet completed (ie, are still running).
        var pending = {
            all: 0,
            get: 0,
            post: 0,
            delete: 0,
            put: 0,
            head: 0
        };
        // Return the public API.
        return({
            pending: pending,
            total: total,
            endRequest: endRequest,
            startRequest: startRequest,
        });
        // ---
        // PUBLIC METHODS.
        // ---
        // I stop tracking the given HTTP request.
        function endRequest( httpMethod ) {
            httpMethod = normalizedHttpMethod( httpMethod );
            pending.all--;
            pending[ httpMethod ]--;
            // EDGE CASE: In the unlikely event that the interceptors were not
            // able to obtain the config object; or, the method was changed after
            // our interceptor reached it, there's a chance that our numbers will
            // be off. In such a case, we want to try to redistribute negative
            // counts onto other properties.
            if ( pending[ httpMethod ] < 0 ) {
                redistributePendingCounts( httpMethod );
            }
        }
        // I start tracking the given HTTP request.
        function startRequest( httpMethod ) {
            httpMethod = normalizedHttpMethod( httpMethod );
            total.all++;
            total[ httpMethod ]++;
            pending.all++;
            pending[ httpMethod ]++;
        }
        // ---
        // PRIVATE METHODS.
        // ---
        // I make sure the given HTTP method is recognizable. If it's not, it is
        // converted to "get" for consumption.
        function normalizedHttpMethod( httpMethod ) {
            httpMethod = ( httpMethod || "" ).toLowerCase();
            switch ( httpMethod ) {
                case "get":
                case "post":
                case "delete":
                case "put":
                case "head":
                    return( httpMethod );
                break;
            }
            return( "get" );
        }
        // I attempt to redistribute an [unexpected] negative count to other
        // non-negative counts. The HTTP methods are iterated in likelihood of
        // execution. And, while this isn't an exact science, it will normalize
        // after all HTTP requests have finished processing.
        function redistributePendingCounts( negativeMethod ) {
            var overflow = Math.abs( pending[ negativeMethod ] );
            pending[ negativeMethod ] = 0;
            // List in likely order of precedence in the application.
            var methods = [ "get", "post", "delete", "put", "head" ];
            // Trickle the overflow across the list of methods.
            for ( var i = 0 ; i < methods.length ; i++ ) {
                var method = methods[ i ];
                if ( overflow && pending[ method ] ) {
                    pending[ method ] -= overflow;
                    if ( pending[ method ] < 0 ) {
                        overflow = Math.abs( pending[ method ] );
                        pending[ method ] = 0;
                    } else {
                        overflow = 0;
                    }
                }
            }
        }
    }
);

