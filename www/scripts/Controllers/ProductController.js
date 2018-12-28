angular.module('MyApp').controller('ProductController', function ($scope,$http,$route,$location,$window,$timeout) {
 
  
  M.AutoInit();
  $scope.openNav = function() {
    document.getElementById("mySidenav").style.width = "250px";
    }
    
    $scope.closeNav = function() {
    document.getElementById("mySidenav").style.width = "0";
    }
    

    $scope.HitNav = function() {
      if(document.getElementById("mySidenav").style.width == '' || document.getElementById("mySidenav").style.width == '0px')
      {
        $scope.openNav()
      }
      else
      {
        $scope.closeNav();
      }
		
    };
    
    $(document).click(function(e){
      if ($(e.target).is('.container,.container *')) {
        $scope.closeNav();
      }
      else
      {
       
      }
  });
      
    
    $scope.NotificationsList = []
    for(var i = 0 ; i < 35;i++)
    {
      $scope.NotificationsList.push({message:"Productddddd- "+i})
    }
    

  

$scope.BrandsList = [{id:1,name:'brand 1',description:'n.a'},{id:2,name:'brand 2',description:'n.a'}];


function readURL(input) {
  if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
          $('#imgpanel').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
  }
}

$("#imgInp").change(function(){
  readURL(this);
});

$scope.clear = function () {
  $("#imgInp").val(null);
  document.getElementById("imgpanel").src = '';
};

});