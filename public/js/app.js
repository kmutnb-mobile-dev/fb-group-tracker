angular.module('myApp', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");
    $stateProvider
      .state('home', {
        url: "/home",
        templateUrl: "partials/home.html"
      })
      .state('tag', {
        url: '/tag/:status',
        templateUrl: "partials/tag.html",
        controller: "TagController"
      });
  })
  .factory('APIConnection', function($http) {
    return {
      getMessages: function(tagName, success, error){
        console.log(":::::"+tagName);
        
        $http.get('/api/status/'+tagName)
        .success(function(data, status, headers, config) {
          success(data);
        })
        .error(function(data, status, headers, config) {
          error(status);
        });
      }
    };
  })

  .controller('TagController', ['$scope', '$stateParams', 'APIConnection',
    function($scope, $stateParams, APIConnection) {
      $scope.noData = false;
      $scope.loading = true;


      $scope.tagName = $stateParams.status;
      APIConnection.getMessages($scope.tagName, function success(data){
        $scope.messages = data;
        $scope.loading = false;
        if(data.length === 0){
          $scope.noData = true;
        }else{
          $scope.noData = false;
        }
      },function error(status){
        alert(status);
      });
    }
  ]);